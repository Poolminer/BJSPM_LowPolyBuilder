import { Color3, Matrix, Mesh, MeshBuilder, StandardMaterial, Vector3, VertexBuffer, VertexData } from "@babylonjs/core";
import { LowPolyAirplaneEngineBuilder } from './airplaneEngine';
import { LowPolyAirplaneWingBuilder } from './airplaneWing';
export var LowPolyAirplaneBuilderVersion;
(function (LowPolyAirplaneBuilderVersion) {
    LowPolyAirplaneBuilderVersion[LowPolyAirplaneBuilderVersion["V1"] = 0] = "V1";
})(LowPolyAirplaneBuilderVersion || (LowPolyAirplaneBuilderVersion = {}));
export var LowPolyAirplaneBody;
(function (LowPolyAirplaneBody) {
    LowPolyAirplaneBody[LowPolyAirplaneBody["B747"] = 0] = "B747";
    LowPolyAirplaneBody[LowPolyAirplaneBody["A380_STRETCH"] = 1] = "A380_STRETCH";
})(LowPolyAirplaneBody || (LowPolyAirplaneBody = {}));
export var LowPolyAirplaneParts;
(function (LowPolyAirplaneParts) {
    LowPolyAirplaneParts[LowPolyAirplaneParts["BODY"] = 0] = "BODY";
    LowPolyAirplaneParts[LowPolyAirplaneParts["MAIN_WING_LEFT"] = 1] = "MAIN_WING_LEFT";
    LowPolyAirplaneParts[LowPolyAirplaneParts["MAIN_WING_RIGHT"] = 2] = "MAIN_WING_RIGHT";
    LowPolyAirplaneParts[LowPolyAirplaneParts["TAIL_WING_LEFT"] = 3] = "TAIL_WING_LEFT";
    LowPolyAirplaneParts[LowPolyAirplaneParts["TAIL_WING_RIGHT"] = 4] = "TAIL_WING_RIGHT";
    LowPolyAirplaneParts[LowPolyAirplaneParts["TAIL_WING_TOP"] = 5] = "TAIL_WING_TOP";
    LowPolyAirplaneParts[LowPolyAirplaneParts["ENGINE"] = 6] = "ENGINE";
    LowPolyAirplaneParts[LowPolyAirplaneParts["ENGINE_HOLDER"] = 7] = "ENGINE_HOLDER";
})(LowPolyAirplaneParts || (LowPolyAirplaneParts = {}));
export class LowPolyAirplaneBuilder {
    static GetDefaultOptions(version = LowPolyAirplaneBuilderVersion.V1) {
        switch (version) {
            case LowPolyAirplaneBuilderVersion.V1:
                return {
                    version: LowPolyAirplaneBuilderVersion.V1,
                    enginesPerWing: 2,
                    bodyType: LowPolyAirplaneBody.B747,
                    bodyMaterial: null,
                    finMaterial: null,
                    mainWingsCreationOptions: null,
                    tailWingsCreationOptions: null,
                    engineCreationOptions: LowPolyAirplaneEngineBuilder.GetDefaultOptions(),
                    engineHolderWidth: 2,
                    engineHolderHeight: 1,
                    engineHolderDepth: 0.125,
                    engineHolderSkewing: 1.2,
                };
            default:
                return LowPolyAirplaneBuilder.GetDefaultOptions(LowPolyAirplaneBuilderVersion.V1);
        }
    }
    /**
     * Creates a new options object by combining the provided `options` object with missing parameters from the provided `defaultOptions` object.
     *
     * @param options the (incomplete) options
     * @param defaultOptions the options to take parameters from
     * @returns the new options object
     */
    static GetOptions(options, defaultOptions) {
        let _options = {};
        if (!options) {
            options = {};
        }
        if (!defaultOptions) {
            defaultOptions = LowPolyAirplaneBuilder.GetDefaultOptions(options ? options.version : undefined);
        }
        for (let param in defaultOptions) {
            if (options[param] === undefined) {
                _options[param] = defaultOptions[param];
            }
            else {
                _options[param] = options[param];
            }
        }
        return _options;
    }
    /**
     * Creates a low-poly airplane
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the airplane, defaults to `LowPolyAirplaneBuilder.GetDefaultOptions(LowPolyAirplaneBuilderVersion.V1)`
     * @param mergeExcludes which parts of the airplane not to merge into one mesh, as in `LowPolyAirplaneParts`
     * @returns a low-poly airplane
     */
    static CreateAirplane(name, scene, options = {}, mergeExcludes = []) {
        let _options = LowPolyAirplaneBuilder.GetOptions(options);
        let bodyColor = new Color3();
        let wingsColorMain = new Color3();
        Color3.HSVtoRGBToRef(Math.round(Math.random() * 255), Math.random(), 1.0, bodyColor);
        let hsv = bodyColor.toHSV();
        Color3.HSVtoRGBToRef((hsv.r + 128) % 256, hsv.g, hsv.b, wingsColorMain);
        _options.engineCreationOptions = LowPolyAirplaneEngineBuilder.GetOptions(_options.engineCreationOptions);
        let mainWingsCreationOptions = LowPolyAirplaneWingBuilder.GetDefaultOptions(_options.mainWingsCreationOptions === null ? undefined : _options.mainWingsCreationOptions.version);
        mainWingsCreationOptions = LowPolyAirplaneWingBuilder.GetDefaultOptions();
        mainWingsCreationOptions.length = 4;
        mainWingsCreationOptions.width = mainWingsCreationOptions.length * 0.35;
        mainWingsCreationOptions.yaw = Math.PI / 8;
        mainWingsCreationOptions.pitch = 0;
        mainWingsCreationOptions.height = 0.061;
        _options.mainWingsCreationOptions = LowPolyAirplaneWingBuilder.GetOptions(_options.mainWingsCreationOptions, mainWingsCreationOptions);
        if (_options.mainWingsCreationOptions.material === null) {
            let mat = new StandardMaterial('mat', scene);
            mat.diffuseColor = wingsColorMain;
            _options.mainWingsCreationOptions.material = mat;
        }
        let tailWingsCreationOptions = LowPolyAirplaneWingBuilder.GetDefaultOptions(_options.tailWingsCreationOptions === null ? undefined : _options.tailWingsCreationOptions.version);
        tailWingsCreationOptions.length = 1.3;
        tailWingsCreationOptions.width = _options.mainWingsCreationOptions.length * 0.20;
        tailWingsCreationOptions.yaw = Math.PI / 8;
        tailWingsCreationOptions.pitch = Math.PI / 32;
        tailWingsCreationOptions.height = 0.03;
        _options.tailWingsCreationOptions = LowPolyAirplaneWingBuilder.GetOptions(_options.tailWingsCreationOptions, tailWingsCreationOptions);
        if (_options.tailWingsCreationOptions.material === null) {
            _options.tailWingsCreationOptions.material = _options.mainWingsCreationOptions.material;
        }
        if (_options.bodyMaterial === null) {
            let mat = new StandardMaterial('mat', scene);
            mat.diffuseColor = bodyColor;
            _options.bodyMaterial = mat;
        }
        if (_options.engineCreationOptions.bodyMaterial === null) {
            _options.engineCreationOptions.bodyMaterial = _options.bodyMaterial;
        }
        if (_options.engineCreationOptions.innardMaterial === null) {
            _options.engineCreationOptions.innardMaterial = _options.mainWingsCreationOptions.material;
        }
        if (_options.engineCreationOptions.ringMaterial === null) {
            _options.engineCreationOptions.ringMaterial = _options.mainWingsCreationOptions.material;
        }
        let bodyPoints2D = [];
        let bodyPoints = [];
        let scale = 0.01;
        switch (_options.bodyType) {
            case LowPolyAirplaneBody.A380_STRETCH:
                bodyPoints2D = [35, 293, 128, 280, 218, 274, 623, 274, 672, 274, 704, 276, 728, 284, 750, 302, 760, 311, 777, 324, 780, 329, 775, 340, 760, 347, 725, 353, 675, 354, 330, 359, 260, 353, 143, 334, 72, 317, 35, 305, 35, 293];
                break;
            case LowPolyAirplaneBody.B747:
            default:
                bodyPoints2D = [34, 297, 39, 287, 56, 283, 451, 283, 506, 279, 559, 274, 607, 274, 685, 274, 709, 275, 722, 279, 737, 291, 755, 300, 776, 312, 783, 318, 782, 326, 769, 336, 753, 343, 726, 350, 679, 357, 666, 359, 616, 360, 295, 360, 251, 355, 44, 311, 38, 307, 34, 303, 34, 297];
                break;
        }
        for (let i = 0; i < bodyPoints2D.length; i += 2) {
            bodyPoints.push(new Vector3(bodyPoints2D[i + 0] * scale, -bodyPoints2D[i + 1] * scale, 0));
        }
        let center = Vector3.Zero();
        for (let point of bodyPoints) {
            center.addInPlace(point);
        }
        center.scaleInPlace(1 / bodyPoints.length);
        let highest = -Infinity;
        let lowest = Infinity;
        for (let point of bodyPoints) {
            if (point.y > highest) {
                highest = point.y;
            }
            if (point.y < lowest) {
                lowest = point.y;
            }
            point.subtractInPlace(center);
        }
        let bodyHeight = highest - lowest;
        let bodyPath = [];
        let numPathPoints = 13;
        for (let i = 0; i < numPathPoints; i++) {
            let div = i / (numPathPoints - 1);
            let rad = div * Math.PI;
            bodyPath.push(new Vector3(0, 0, Math.cos(rad)));
        }
        let scaleFn = function (index) {
            let div = index / (numPathPoints - 1);
            let rad = div * Math.PI;
            return Math.sin(rad);
        };
        let body = MeshBuilder.ExtrudeShapeCustom('body', { shape: bodyPoints, path: bodyPath, scaleFunction: scaleFn, sideOrientation: Mesh.DOUBLESIDE }, scene);
        body.scaling.z = 0.5;
        body.computeWorldMatrix(true);
        body.material = _options.bodyMaterial;
        let rightWing = LowPolyAirplaneWingBuilder.CreateWing('wing_main_right', scene, {
            right: true,
            width: _options.mainWingsCreationOptions.width,
            height: _options.mainWingsCreationOptions.height,
            length: _options.mainWingsCreationOptions.length,
            yaw: _options.mainWingsCreationOptions.yaw,
            pitch: _options.mainWingsCreationOptions.pitch,
            falloff: _options.mainWingsCreationOptions.falloff,
            material: _options.mainWingsCreationOptions.material,
        });
        let leftWing = LowPolyAirplaneWingBuilder.CreateWing('wing_main_left', scene, {
            right: false,
            width: _options.mainWingsCreationOptions.width,
            height: _options.mainWingsCreationOptions.height,
            length: _options.mainWingsCreationOptions.length,
            yaw: _options.mainWingsCreationOptions.yaw,
            pitch: _options.mainWingsCreationOptions.pitch,
            falloff: _options.mainWingsCreationOptions.falloff,
            material: _options.mainWingsCreationOptions.material,
        });
        let rightTailWing = LowPolyAirplaneWingBuilder.CreateWing('wing_tail_right', scene, {
            right: true,
            width: _options.tailWingsCreationOptions.width,
            height: _options.tailWingsCreationOptions.height,
            length: _options.tailWingsCreationOptions.length,
            yaw: _options.tailWingsCreationOptions.yaw,
            pitch: _options.tailWingsCreationOptions.pitch,
            falloff: _options.tailWingsCreationOptions.falloff,
            material: _options.tailWingsCreationOptions.material,
        });
        let leftTailWing = LowPolyAirplaneWingBuilder.CreateWing('wing_tail_left', scene, {
            right: false,
            width: _options.tailWingsCreationOptions.width,
            height: _options.tailWingsCreationOptions.height,
            length: _options.tailWingsCreationOptions.length,
            yaw: _options.tailWingsCreationOptions.yaw,
            pitch: _options.tailWingsCreationOptions.pitch,
            falloff: _options.tailWingsCreationOptions.falloff,
            material: _options.tailWingsCreationOptions.material,
        });
        let topTailWingPoints2D = [55, 282, 11, 176, 56, 175, 191, 282, 55, 282];
        let topTailWingPoints = [];
        scale = 0.008;
        for (let i = 0; i < topTailWingPoints2D.length; i += 2) {
            topTailWingPoints2D[i + 0] -= topTailWingPoints2D[topTailWingPoints2D.length - 2];
            topTailWingPoints2D[i + 1] -= topTailWingPoints2D[topTailWingPoints2D.length - 1];
            topTailWingPoints.push(new Vector3(-topTailWingPoints2D[i + 0] * scale, -topTailWingPoints2D[i + 1] * scale, 0));
        }
        let topTailWingPath = [new Vector3(0, 0, 0), new Vector3(0, 0, 0.025)];
        let topTailWing = MeshBuilder.ExtrudeShapeCustom('top_tail_wing', { shape: topTailWingPoints, path: topTailWingPath, cap: Mesh.CAP_ALL, sideOrientation: Mesh.DOUBLESIDE }, scene);
        let numEngines = _options.enginesPerWing;
        let engineScale = (numEngines === 1 ? 0.20 : 0.15);
        let shiftX = -10 / 12;
        let shiftY = -0.30 - (0.15 - (_options.engineCreationOptions.scale - 1) * 0.3 - engineScale) * 1.4;
        let shiftZ = 0.34;
        rightWing.position.x += shiftX;
        leftWing.position.x += shiftX;
        rightWing.position.y += shiftY;
        leftWing.position.y += shiftY;
        rightWing.position.z += shiftZ;
        leftWing.position.z -= shiftZ;
        shiftX = 3.5;
        shiftY = 0.1;
        shiftZ = 0.140;
        topTailWing.computeWorldMatrix();
        let bi = topTailWing.getBoundingInfo().boundingBox.extendSize.y;
        rightTailWing.position.x += shiftX;
        leftTailWing.position.x += shiftX;
        topTailWing.position.x += 4.2;
        topTailWing.position.y += bi / 2;
        rightTailWing.position.y += shiftY;
        leftTailWing.position.y += shiftY;
        rightTailWing.position.z += shiftZ;
        leftTailWing.position.z -= shiftZ;
        topTailWing.material = _options.finMaterial === null ? leftTailWing.material : _options.finMaterial;
        let engineScaleX = 0.8;
        let yawMatLeft = Matrix.RotationYawPitchRoll(-_options.mainWingsCreationOptions.yaw, 0, 0);
        let yawMatRight = Matrix.RotationYawPitchRoll(_options.mainWingsCreationOptions.yaw, 0, 0);
        let w = _options.engineHolderWidth;
        let h = _options.engineHolderHeight;
        let d = _options.engineHolderDepth;
        let skew = _options.engineHolderSkewing;
        let attachPoints2D = [w * skew, 0, 0, h, w * 0.8, h, w * 3, 0, w * skew, 0];
        let attachPoints = [];
        scale = 0.1;
        for (let i = 0; i < attachPoints2D.length; i += 2) {
            attachPoints.push(new Vector3(attachPoints2D[i + 0] * scale, attachPoints2D[i + 1] * scale, 0));
        }
        scaleFn = function (index) {
            return 1;
        };
        let attachPath = [new Vector3(0, 0, 0), new Vector3(0, 0, d)];
        let engineMeshes = [];
        let engineHolderMeshes = [];
        for (let i = 0; i < numEngines; i++) {
            let position = leftWing.position.clone();
            position.x += 0.2;
            let pos = numEngines === 1 ? 0.33 : (i + 1) / (numEngines + 1);
            let engShift = new Vector3(_options.mainWingsCreationOptions.width / 2 * (1 - _options.mainWingsCreationOptions.falloff) * pos, 0, -pos * 4);
            position.addInPlace(Vector3.TransformCoordinates(engShift, yawMatLeft));
            let attachMesh = MeshBuilder.ExtrudeShapeCustom('holder_left_' + (i + 1), { shape: attachPoints, path: attachPath, cap: Mesh.CAP_ALL, sideOrientation: Mesh.DOUBLESIDE });
            attachMesh.position = position.clone();
            attachMesh.position.z += d / 2;
            attachMesh.position.y -= h * scale + 0.3 * scale;
            attachMesh.rotation.y = Math.PI;
            attachMesh.convertToFlatShadedMesh();
            attachMesh.material = _options.tailWingsCreationOptions.material;
            let eng = LowPolyAirplaneEngineBuilder.CreateEngine('engine_left_' + (i + 1), scene, _options.engineCreationOptions);
            eng.position = position.clone();
            eng.position.x -= w * scale * 2;
            eng.position.y -= h * scale;
            eng.scaling.scaleInPlace(engineScale);
            eng.scaling.x *= engineScaleX;
            engineMeshes.push(eng);
            engineHolderMeshes.push(attachMesh);
        }
        _options.engineCreationOptions.angle = Math.PI;
        for (let i = 0; i < numEngines; i++) {
            let position = rightWing.position.clone();
            position.x += 0.2;
            let pos = numEngines === 1 ? 0.33 : (i + 1) / (numEngines + 1);
            let engShift = new Vector3(_options.mainWingsCreationOptions.width / 2 * (1 - _options.mainWingsCreationOptions.falloff) * pos, 0, pos * 4);
            position.addInPlace(Vector3.TransformCoordinates(engShift, yawMatRight));
            let attachMesh = MeshBuilder.ExtrudeShapeCustom('holder_right_' + (i + 1), { shape: attachPoints, path: attachPath, cap: Mesh.CAP_ALL, sideOrientation: Mesh.DOUBLESIDE });
            attachMesh.position = position.clone();
            attachMesh.position.z += d / 2;
            attachMesh.position.y -= h * scale + 0.3 * scale;
            attachMesh.rotation.y = Math.PI;
            attachMesh.convertToFlatShadedMesh();
            attachMesh.material = _options.tailWingsCreationOptions.material;
            let eng = LowPolyAirplaneEngineBuilder.CreateEngine('engine_right_' + (i + 1), scene, _options.engineCreationOptions);
            eng.position = position.clone();
            eng.position.x -= w * scale * 2;
            eng.position.y -= h * scale;
            eng.scaling.scaleInPlace(engineScale);
            eng.scaling.x *= engineScaleX;
            engineMeshes.push(eng);
            engineHolderMeshes.push(attachMesh);
        }
        body.bakeCurrentTransformIntoVertices();
        let positions = body.getVerticesData(VertexBuffer.PositionKind);
        let indices = body.getIndices();
        let normals = body.getVerticesData(VertexBuffer.NormalKind);
        VertexData.ComputeNormals(positions, indices, normals);
        body.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
        body.bakeCurrentTransformIntoVertices();
        let toMerge = [];
        if (mergeExcludes.indexOf(LowPolyAirplaneParts.BODY) === -1) {
            toMerge.push(body);
        }
        if (mergeExcludes.indexOf(LowPolyAirplaneParts.MAIN_WING_LEFT) === -1) {
            toMerge.push(leftWing);
        }
        if (mergeExcludes.indexOf(LowPolyAirplaneParts.MAIN_WING_RIGHT) === -1) {
            toMerge.push(rightWing);
        }
        if (mergeExcludes.indexOf(LowPolyAirplaneParts.TAIL_WING_LEFT) === -1) {
            toMerge.push(leftTailWing);
        }
        if (mergeExcludes.indexOf(LowPolyAirplaneParts.TAIL_WING_RIGHT) === -1) {
            toMerge.push(rightTailWing);
        }
        if (mergeExcludes.indexOf(LowPolyAirplaneParts.TAIL_WING_TOP) === -1) {
            toMerge.push(topTailWing);
        }
        if (mergeExcludes.indexOf(LowPolyAirplaneParts.ENGINE) === -1) {
            toMerge.push(...engineMeshes);
        }
        if (mergeExcludes.indexOf(LowPolyAirplaneParts.ENGINE_HOLDER) === -1) {
            toMerge.push(...engineHolderMeshes);
        }
        let allMeshes = [body, leftWing, rightWing, leftTailWing, rightTailWing, topTailWing, ...engineMeshes, ...engineHolderMeshes];
        for (let mesh of allMeshes) {
            mesh.position.y += bodyHeight / 2;
        }
        if (toMerge.length === 0) {
            let airplaneMesh = new Mesh(name, scene);
            for (let mesh of allMeshes) {
                mesh.parent = airplaneMesh;
            }
            return airplaneMesh;
        }
        let merged = Mesh.MergeMeshes(toMerge, true, undefined, undefined, undefined, true);
        if (mergeExcludes.length === 0) {
            merged.name = name;
            return merged;
        }
        merged.name = 'merged';
        let airplaneMesh = new Mesh(name, scene);
        merged.parent = airplaneMesh;
        for (let mesh of allMeshes) {
            if (toMerge.indexOf(mesh) === -1) {
                mesh.parent = airplaneMesh;
            }
        }
        return airplaneMesh;
    }
}
