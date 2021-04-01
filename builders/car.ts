import { MultiMaterial } from '@babylonjs/core/Materials/multiMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Curve3 } from '@babylonjs/core/Maths/math.path';
import { Matrix, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Scene } from '@babylonjs/core/scene';
import { LowPolyCarLightBuilder } from './carLight';
import { LowPolyWheelBuilder } from './wheel';

export interface LowPolyCarBuilderOptionsV1 {
    version?: LowPolyCarBuilderVersion,
    randomFn?: () => number, /** The random number generator, defaults to `Math.random` */
    maxHoodOffset?: number,
    maxBackSeatOffset?: number,
    lightSize?: number,
    globalColorMultiplier?: number, /** All colors get multiplied by this value */
    bodyColor?: string,
    bodyColorMultiplier?: number, /** How desaturated the provided body color should be made */
    colorEmission?: number, /** How emissive the colors are */
    width?: number,
    windowColor?: string,
    licensePlateColor?: string,
    licensePlateType?: LowPolyLicensePlateType,
    frontLightsColor?: string,
    tailLightsColor?: string,
    tireColor?: string,
    wheelHubcapColor?: string
}
type LowPolyCarBuilderOptions = LowPolyCarBuilderOptionsV1;

export interface LowPolyLicensePlateType {
    size: number,
    ratio: number
}

export enum LowPolyCarParts {
    WHEEL_FRONT_LEFT,
    WHEEL_FRONT_RIGHT,
    WHEEL_REAR_LEFT,
    WHEEL_REAR_RIGHT,
    LIGHT_HEAD_LEFT,
    LIGHT_HEAD_RIGHT,
    LIGHT_TAIL_LEFT,
    LIGHT_TAIL_RIGHT,
    LICENSE_PLATE_FRONT,
    LICENSE_PLATE_REAR
}

export enum LowPolyCarBuilderVersion {
    V1
}

export const LowPolyLicensePlateTypes = {
    EU: {
        size: 2.25,
        ratio: 520 / 110
    } as LowPolyLicensePlateType,
    US: {
        size: 1.5,
        ratio: 12 / 6
    } as LowPolyLicensePlateType
}

export class LowPolyCarBuilder {

    public static GetDefaultOptions(version = LowPolyCarBuilderVersion.V1): LowPolyCarBuilderOptions {
        switch (version) {
            case LowPolyCarBuilderVersion.V1:
                return {
                    version: LowPolyCarBuilderVersion.V1,
                    randomFn: Math.random,
                    maxHoodOffset: 1,
                    maxBackSeatOffset: 1,
                    lightSize: 1,
                    globalColorMultiplier: 1,
                    bodyColor: null,
                    bodyColorMultiplier: 0.60,
                    colorEmission: 0.15,
                    width: 1,
                    windowColor: '#D6F0FF',
                    licensePlateColor: '#FFFFFF',
                    licensePlateType: LowPolyLicensePlateTypes.EU,
                    frontLightsColor: '#FFEA84',
                    tailLightsColor: '#FF3838',
                    tireColor: '#4D4D4B',
                    wheelHubcapColor: '#E0E0DB'
                };
            default:
                return LowPolyCarBuilder.GetDefaultOptions(LowPolyCarBuilderVersion.V1);
        }
    }

    /**
     * Creates a low-poly car mesh
     * 
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the car, defaults to `LowPolyCarBuilder.GetDefaultParams(LowPolyCarBuilderVersion.V1)`
     * @param mergeExcludes which parts of the car not to merge into one mesh, as in `LowPolyCarParts`
     * @returns a low-poly car mesh
     */
    public static CreateCar(name: string, scene: Scene, options = {} as LowPolyCarBuilderOptions, mergeExcludes: LowPolyCarParts[] = []): Mesh {
        let _options = {} as LowPolyCarBuilderOptions;
        let defaultParams = LowPolyCarBuilder.GetDefaultOptions(options.version);

        for (let param in defaultParams) {
            if (options[param] === undefined) {
                _options[param] = defaultParams[param];
            } else {
                _options[param] = options[param];
            }
        }

        var pairs: number[][] = [[162, 107], [162, 78], [220, 78], [251, 43], [330, 43], [330, 78], [330, 78], [330, 107], [328, 107], [317, 91], [294, 91], [283, 107], [212, 107], [201, 91], [178, 91], [167, 107], [162, 107]];
        var points: Vector3[] = [];
        var scale = new Vector3(0.01, -0.01, 1);

        for (let pair of pairs) {
            points.push(new Vector3(pair[0] * scale.x, 0, pair[1] * scale.y));
        }

        let random = _options.randomFn;
        let hoodOffset = random() * _options.maxHoodOffset;
        let windshieldOffset = random() * hoodOffset;
        let frontTireOffset = hoodOffset - 0.2;
        let backSeatOffset = random() * _options.maxBackSeatOffset;
        let trunkOffset = random() * hoodOffset;
        let backWindowOffset = random() * trunkOffset;
        let backTireOffset = -0.05 + backSeatOffset;
        let tireSize = 0.5 + (hoodOffset + trunkOffset) * 0.7;
        let bodyOffset = tireSize * 0.1 + random() * 0.2;
        let lightSize = _options.lightSize * 0.09;
        let lightDepth = lightSize / 10;
        let sizes: number[] = [];

        let partIndices = {
            hood: [0, 1, 16],
            windshield: [2],
            frontTires: [12, 13, 14, 15],
            backSeats: [4, 5, 6, 7],
            backWindow: [5],
            trunk: [6, 7],
            backTires: [8, 9, 10, 11],
            body: [1, 2, 3, 4, 5, 6]
        };

        for (let i of partIndices.hood) {
            points[i].x -= hoodOffset;
        }
        for (let i of partIndices.windshield) {
            points[i].x -= windshieldOffset;
        }
        for (let i of partIndices.frontTires) {
            points[i].x -= frontTireOffset;
        }
        for (let i of partIndices.backSeats) {
            points[i].x += backSeatOffset;
        }
        for (let i of partIndices.backWindow) {
            points[i].x += backWindowOffset;
        }
        for (let i of partIndices.trunk) {
            points[i].x += trunkOffset;
        }
        for (let i of partIndices.backTires) {
            points[i].x += backTireOffset;
        }
        for (let i of partIndices.body) {
            points[i].z += bodyOffset;
        }
        points[partIndices.frontTires[0]].x += tireSize / 20;
        points[partIndices.frontTires[3]].x -= tireSize / 20;
        points[partIndices.frontTires[1]].x += tireSize / 20;
        points[partIndices.frontTires[2]].x -= tireSize / 20;
        points[partIndices.frontTires[1]].z += tireSize / 10;
        points[partIndices.frontTires[2]].z += tireSize / 10;

        points[partIndices.backTires[0]].x += tireSize / 20;
        points[partIndices.backTires[3]].x -= tireSize / 20;
        points[partIndices.backTires[1]].x += tireSize / 20;
        points[partIndices.backTires[2]].x -= tireSize / 20;
        points[partIndices.backTires[1]].z += tireSize / 10;
        points[partIndices.backTires[2]].z += tireSize / 10;

        var minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        var maximum = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        for (let point of points) {
            minimum.minimizeInPlaceFromFloats(point.x, point.y, point.z);
            maximum.maximizeInPlaceFromFloats(point.x, point.y, point.z);
        }
        var center = minimum.add(maximum).scale(0.5);
        for (let point of points) {
            point.subtractInPlace(center).z += (maximum.z - minimum.z) / 2;
        }

        var frontWheelAxis = points[partIndices.frontTires[0]].add(points[partIndices.frontTires[3]]).scale(0.5);
        var hindWheelAxis = points[partIndices.backTires[0]].add(points[partIndices.backTires[3]]).scale(0.5);

        var numWheelPoints = 16;
        var wheelSize = frontWheelAxis.subtract(points[partIndices.frontTires[1]]).length() / 1.6;
        var wheelDepth = wheelSize;

        for (let point of points) {
            point.z += wheelSize * 0.75;
        }

        var customMesh = new Mesh("custom", scene);

        var positions: number[] = [];
        var indices: number[] = [];
        var normals: number[] = [];
        var uvs = [0, 0, 1, 0];
        var width = _options.width;
        var curveLength = new Curve3(points).length();

        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            positions.push(point.x, point.y - width / 2, point.z);
            positions.push(point.x, point.y + width / 2, point.z);
        }
        for (let i = 0, j = 0; i < points.length - 1; i++, j += 2) {
            if (i === 2 || i === 4) {
                continue;
            }
            indices.push(j + 0, j + 1, j + 3, j + 0, j + 3, j + 2);
        }

        let currentLength = 0;
        for (let i = 1; i < points.length; i++) {
            currentLength += points[i].subtract(points[i - 1]).length();
            let diff = currentLength / curveLength;
            sizes[i - 1] = diff;
            uvs.push(0, diff, 1, diff);
        }
        VertexData.ComputeNormals(positions, indices, normals);
        var vertexData = new VertexData();

        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;
        vertexData.uvs = uvs;

        vertexData.applyToMesh(customMesh);
        customMesh.convertToFlatShadedMesh();

        customMesh.rotation.x = -Math.PI / 2;

        var window1 = [
            new Vector3(points[2].x, 0, points[2].z),
            new Vector3(points[3].x, 0, points[3].z),
            new Vector3(points[3].x, 0, points[2].z)
        ];
        var fwLen = window1[0].subtract(window1[1]).length();

        let windowWidth = Math.abs(points[3].subtract(points[5]).x);

        var sz = windowWidth / (35 + random() * 15);
        var o = window1[0].subtract(window1[2]).length();
        var a = window1[2].subtract(window1[1]).length();
        var s = window1[0].subtract(window1[1]).length();
        var sin = o / s;
        var f = 1 / sin;
        var w1sin = a / s;
        var a1 = a;
        var o1 = o;

        window1[0].x += (f * sz) * (sin / (a / s));
        window1[1].z -= (f * sz);

        var window2 = [
            new Vector3(points[3].x, 0, points[3].z),
            new Vector3(points[3].x, 0, points[2].z),
            new Vector3(points[3].x + windowWidth / 2, 0, points[2].z),
            new Vector3(points[3].x + windowWidth / 2, 0, points[3].z),
        ];

        window2[0].x += sz;
        window2[1].x += sz;
        window2[0].z -= sz;
        window2[3].z -= sz;

        var window3 = [
            new Vector3(points[3].x + windowWidth / 2, 0, points[3].z),
            new Vector3(points[3].x + windowWidth / 2, 0, points[2].z),
            new Vector3(points[5].x, 0, points[5].z),
            new Vector3(points[4].x, 0, points[4].z)
        ];
        let hndLen = window3[2].subtract(window3[3]).length();

        var a = window3[2].subtract(window3[3]).x;
        var o = window3[0].subtract(window3[1]).length();
        var s = window3[2].subtract(window3[3]).length();
        var sin = o / s;
        var f = 1 / sin;
        var w3cos = a / s;

        window3[0].z -= sz;
        window3[3].z -= sz;
        window3[0].x += sz;
        window3[1].x += sz;
        window3[2].x -= f * sz;
        window3[3].x -= (f * sz) - (sz / o) * a;

        var sbs = sz / 2 * sin;


        window1[0].x += sbs / a1 * o1;
        window1[0].z += sbs;
        window1[2].z += sbs;

        window2[1].z += sbs;
        window2[2].z += sbs;

        window3[2].x -= sbs / o * a;
        window3[1].z += sbs;
        window3[2].z += sbs;

        var window4 = [
            new Vector3(sz / 2, 0, -width / 2 + sz / 2),
            new Vector3(fwLen - sz / 2, 0, -width / 2 + sz / 2),
            new Vector3(fwLen - sz / 2, 0, width / 2 - sz / 2),
            new Vector3(sz / 2, 0, width / 2 - sz / 2)
        ];

        var windshield = [
            new Vector3(0, 0, -width / 2),
            new Vector3(fwLen, 0, -width / 2),
            new Vector3(fwLen, 0, width / 2),
            new Vector3(0, 0, width / 2)
        ];

        var window5 = [
            new Vector3(sz, 0, -width / 2 + sz / 2),
            new Vector3(hndLen - sz / 2, 0, -width / 2 + sz / 2),
            new Vector3(hndLen - sz / 2, 0, width / 2 - sz / 2),
            new Vector3(sz, 0, width / 2 - sz / 2)
        ];

        var hindshield = [
            new Vector3(0, 0, -width / 2),
            new Vector3(hndLen, 0, -width / 2),
            new Vector3(hndLen, 0, width / 2),
            new Vector3(0, 0, width / 2)
        ];

        let windowMaterial = new StandardMaterial("Mat", scene);
        windowMaterial.diffuseColor = Color3.FromHexString(_options.windowColor).scale(_options.globalColorMultiplier);
        windowMaterial.emissiveColor = windowMaterial.diffuseColor.scale(_options.colorEmission).scale(_options.globalColorMultiplier);
        windowMaterial.alpha = 1.0;

        let windows = [window1, window2, window3];
        let sideWindowMeshes = [];

        for (let wnd of windows) {
            let windowMesh = MeshBuilder.ExtrudePolygon('', { shape: wnd, sideOrientation: VertexData.FRONTSIDE }, scene);
            windowMesh.rotation.x = -Math.PI / 2;
            windowMesh.material = windowMaterial;
            let windowMesh2 = windowMesh.clone();
            windowMesh2.makeGeometryUnique();
            windowMesh2.flipFaces();
            windowMesh.position.z -= width / 2;
            windowMesh2.position.z += width / 2;

            sideWindowMeshes.push(windowMesh, windowMesh2);
        }

        let stdMat = new StandardMaterial('', scene);
        (_options.bodyColor ? Color3.FromHexString(_options.bodyColor) : Color3.Random()).scale(_options.bodyColorMultiplier).scaleToRef(_options.globalColorMultiplier, stdMat.diffuseColor);
        stdMat.emissiveColor = stdMat.diffuseColor.scale(_options.colorEmission);
        stdMat.freeze();

        let ws4 = MeshBuilder.ExtrudePolygon('', { shape: windshield, holes: [window4], sideOrientation: VertexData.FRONTSIDE }, scene);
        ws4.position = Vector3.TransformCoordinates(new Vector3(points[2].x, 0, points[2].z), Matrix.RotationX(-Math.PI / 2));
        ws4.rotation.z = Math.asin(w1sin);
        ws4.material = stdMat;

        let w4 = MeshBuilder.ExtrudePolygon('', { shape: window4, sideOrientation: VertexData.FRONTSIDE }, scene);
        w4.position = Vector3.TransformCoordinates(new Vector3(points[2].x, 0, points[2].z), Matrix.RotationX(-Math.PI / 2));
        w4.rotation.z = Math.asin(w1sin);
        w4.material = windowMaterial;

        let ws5 = MeshBuilder.ExtrudePolygon('', { shape: hindshield, holes: [window5], sideOrientation: VertexData.FRONTSIDE }, scene);
        ws5.position = Vector3.TransformCoordinates(new Vector3(points[4].x, 0, points[4].z), Matrix.RotationX(-Math.PI / 2));
        ws5.rotation.z = -Math.PI / 2 + Math.asin(w3cos);
        ws5.material = stdMat;

        let w5 = MeshBuilder.ExtrudePolygon('', { shape: window5, sideOrientation: VertexData.FRONTSIDE }, scene);
        w5.position = Vector3.TransformCoordinates(new Vector3(points[4].x, 0, points[4].z), Matrix.RotationX(-Math.PI / 2));
        w5.rotation.z = -Math.PI / 2 + Math.asin(w3cos);
        w5.material = windowMaterial;

        var car = MeshBuilder.ExtrudePolygon('', { shape: points, holes: [window1, window2, window3], sideOrientation: VertexData.FRONTSIDE }, scene);
        car.rotation.x = -Math.PI / 2;
        car.position.z = -width / 2;

        var positions: number[] = [];
        var indices: number[] = [];
        var normals: number[] = [];
        var uvs: number[] = [];

        var multimat = new MultiMaterial("multi", scene);
        multimat.subMaterials.push(stdMat);
        multimat.subMaterials.push(windowMaterial);
        multimat.freeze();

        customMesh.material = multimat;

        car.material = stdMat;

        var carClone = car.clone();

        carClone.position.z = width / 2;
        carClone.makeGeometryUnique();
        carClone.flipFaces(true);

        let tireMat = new StandardMaterial("Mat", scene);
        tireMat.diffuseColor = Color3.FromHexString(_options.tireColor).scale(_options.globalColorMultiplier);
        tireMat.emissiveColor = tireMat.diffuseColor.scale(_options.colorEmission).scale(_options.globalColorMultiplier);
        tireMat.specularColor = Color3.BlackReadOnly;

        let hubcapMat = new StandardMaterial("Mat", scene);
        hubcapMat.diffuseColor = Color3.FromHexString(_options.wheelHubcapColor).scale(_options.globalColorMultiplier);
        hubcapMat.emissiveColor = hubcapMat.diffuseColor.scale(_options.colorEmission).scale(_options.globalColorMultiplier);

        let hoodHead = Vector3.TransformCoordinates(points[partIndices.hood[1]], Matrix.RotationX(-Math.PI / 2));
        let trunkHead = Vector3.TransformCoordinates(points[partIndices.trunk[0]], Matrix.RotationX(-Math.PI / 2));

        Vector3.TransformCoordinatesToRef(frontWheelAxis, Matrix.RotationX(-Math.PI / 2), frontWheelAxis);
        Vector3.TransformCoordinatesToRef(hindWheelAxis, Matrix.RotationX(-Math.PI / 2), hindWheelAxis);

        var fwl = LowPolyWheelBuilder.CreateWheel('front_wheel_left', scene, { radius: wheelSize, depth: wheelSize, hubcapSize: 0.5, quality: numWheelPoints, tireMat: tireMat, hubcapMat: hubcapMat });
        fwl.position = frontWheelAxis.clone();
        fwl.position.y += wheelSize;
        fwl.position.z -= width / 2 - wheelDepth / 2;

        var fwr = fwl.clone();
        fwr.name = 'front_wheel_right';
        fwr.position = frontWheelAxis.clone();
        fwr.position.y += wheelSize;
        fwr.position.z += width / 2 - wheelDepth / 2;

        var rwl = fwl.clone();
        rwl.name = 'rear_wheel_left';
        rwl.position = hindWheelAxis.clone();
        rwl.position.y += wheelSize;
        rwl.position.z -= width / 2 - wheelDepth / 2;

        var rwr = fwl.clone();
        rwr.name = 'rear_wheel_right';
        rwr.position = hindWheelAxis.clone();
        rwr.position.y += wheelSize;
        rwr.position.z += width / 2 - wheelDepth / 2;

        let flMat = new StandardMaterial("Mat", scene);
        flMat.diffuseColor = Color3.FromHexString(_options.frontLightsColor).scale(_options.globalColorMultiplier);
        flMat.emissiveColor = flMat.diffuseColor.scale(_options.colorEmission).scale(_options.globalColorMultiplier);

        let tlMat = new StandardMaterial("Mat", scene);
        tlMat.diffuseColor = Color3.FromHexString(_options.tailLightsColor).scale(_options.globalColorMultiplier);
        tlMat.emissiveColor = tlMat.diffuseColor.scale(_options.colorEmission).scale(_options.globalColorMultiplier);

        var flSides = random() < 0.5 ? 4 : 4 + Math.round(random() * 6);
        var fll = LowPolyCarLightBuilder.CreateLight('headlight_left', scene, { numSides: flSides, radius: lightSize, depth: lightDepth, rotation: random() > 0.5 ? Math.PI : 0 });
        fll.material = flMat;
        fll.rotation.y = Math.PI / 2;
        fll.position = hoodHead.clone();
        fll.position.x -= lightDepth;
        fll.position.y -= lightSize * (1 + random());
        fll.position.z -= width / 2 - lightSize * (1 + random());

        if (flSides === 4) {
            fll.scaling.x = 1 + random();
            fll.position.z += 0.5 * (fll.scaling.x * lightSize - lightSize);
        }

        var flr = fll.clone();
        flr.name = 'headlight_right';
        flr.position.z *= -1;

        var tll = LowPolyCarLightBuilder.CreateLight('tail_light_left', scene, { numSides: 4, radius: lightSize, depth: lightDepth, rotation: random() > 0.5 ? Math.PI : 0 });
        tll.material = tlMat;
        tll.position = trunkHead.clone();
        tll.rotation.y = -Math.PI / 2;
        tll.position.x += lightDepth;
        tll.position.y -= lightSize * (1 + random());
        tll.position.z -= width / 2 - lightSize * (1 + random());
        tll.scaling.x = 1 + random();
        tll.position.z += 0.5 * (tll.scaling.x * lightSize - lightSize);

        var tlr = tll.clone();
        tlr.name = 'tail_light_right';
        tlr.position.z *= -1;

        var hoodLen = points[partIndices.hood[0]].subtract(points[partIndices.hood[1]]).length();

        let npMat = new StandardMaterial("Mat", scene);
        npMat.diffuseColor = Color3.FromHexString(_options.licensePlateColor).scale(_options.globalColorMultiplier);
        npMat.emissiveColor = npMat.diffuseColor.scale(_options.colorEmission).scale(_options.globalColorMultiplier);

        var npSize = 0.1;
        var npf = LowPolyCarLightBuilder.CreateLight('license_plate_front', scene, { numSides: 4, radius: npSize, depth: lightDepth, rotation: 0 });
        npf.material = npMat;
        npf.rotation.y = Math.PI / 2;
        npf.position = hoodHead.clone();
        npf.position.x -= lightDepth;
        npf.position.y -= hoodLen - npSize;

        let licensePlateSize = _options.licensePlateType.size;
        let licensePlateRatio = _options.licensePlateType.ratio;

        npf.scaling.set(licensePlateSize, licensePlateSize / licensePlateRatio, 1);

        var npt = npf.clone();
        npt.name = 'license_plate_rear';
        npt.rotation.y = -Math.PI / 2;
        npt.position = trunkHead.clone();
        npt.position.x += lightDepth;
        npt.position.y -= hoodLen - npSize;

        var allMeshes = [customMesh, car, carClone, fwl, fwr, rwl, rwr, fll, flr, npf, npt, tll, tlr, ws4, w4, ws5, w5, ...sideWindowMeshes];
        var toMerge: Mesh[] = [customMesh, car, carClone, ws4, w4, ws5, w5, ...sideWindowMeshes];

        // wheels
        if (mergeExcludes.indexOf(LowPolyCarParts.WHEEL_FRONT_LEFT) === -1) {
            toMerge.push(fwl);
        }
        if (mergeExcludes.indexOf(LowPolyCarParts.WHEEL_FRONT_RIGHT) === -1) {
            toMerge.push(fwr);
        }
        if (mergeExcludes.indexOf(LowPolyCarParts.WHEEL_REAR_RIGHT) === -1) {
            toMerge.push(rwr);
        }
        if (mergeExcludes.indexOf(LowPolyCarParts.WHEEL_REAR_LEFT) === -1) {
            toMerge.push(rwl);
        }

        // lights
        if (mergeExcludes.indexOf(LowPolyCarParts.LIGHT_HEAD_LEFT) === -1) {
            toMerge.push(fll);
        }
        if (mergeExcludes.indexOf(LowPolyCarParts.LIGHT_HEAD_RIGHT) === -1) {
            toMerge.push(flr);
        }
        if (mergeExcludes.indexOf(LowPolyCarParts.LIGHT_TAIL_RIGHT) === -1) {
            toMerge.push(tlr);
        }
        if (mergeExcludes.indexOf(LowPolyCarParts.LIGHT_TAIL_LEFT) === -1) {
            toMerge.push(tll);
        }

        // license plates
        if (mergeExcludes.indexOf(LowPolyCarParts.LICENSE_PLATE_FRONT) === -1) {
            toMerge.push(npf);
        }
        if (mergeExcludes.indexOf(LowPolyCarParts.LICENSE_PLATE_REAR) === -1) {
            toMerge.push(npt);
        }

        var merged = Mesh.MergeMeshes(toMerge, true, undefined, undefined, undefined, true);

        if (mergeExcludes.length === 0) {
            merged.name = name;
            return merged;
        }
        merged.name = 'merged';

        var carMesh = new Mesh(name, scene);
        merged.parent = carMesh;

        for (let mesh of allMeshes) {
            if (toMerge.indexOf(mesh) === -1) {
                mesh.parent = carMesh;
            }
        }
        return carMesh;
    }
}