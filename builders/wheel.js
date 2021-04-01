import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
export var LowPolyWheelBuilderVersion;
(function (LowPolyWheelBuilderVersion) {
    LowPolyWheelBuilderVersion[LowPolyWheelBuilderVersion["V1"] = 0] = "V1";
})(LowPolyWheelBuilderVersion || (LowPolyWheelBuilderVersion = {}));
export var LowPolyWheelType;
(function (LowPolyWheelType) {
    LowPolyWheelType[LowPolyWheelType["CAR"] = 0] = "CAR";
})(LowPolyWheelType || (LowPolyWheelType = {}));
export class LowPolyWheelBuilder {
    static GetDefaultOptions(version = LowPolyWheelBuilderVersion.V1) {
        switch (version) {
            case LowPolyWheelBuilderVersion.V1:
                return {
                    version: LowPolyWheelBuilderVersion.V1,
                    type: LowPolyWheelType.CAR,
                    radius: 1,
                    depth: 1,
                    hubcapSize: 0.5,
                    tireMat: null,
                    hubcapMat: null,
                    quality: 16
                };
            default:
                return LowPolyWheelBuilder.GetDefaultOptions(LowPolyWheelBuilderVersion.V1);
        }
    }
    /**
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the wheel, defaults to `LowPolyWheelBuilder.GetDefaultOptions(LowPolyWheelBuilderVersion.V1)`
     * @returns a low-poly wheel
     */
    static CreateWheel(name, scene, options = {}) {
        let _options = {};
        let defaultOptions = LowPolyWheelBuilder.GetDefaultOptions(options.version);
        for (let param in defaultOptions) {
            if (options[param] === undefined) {
                _options[param] = defaultOptions[param];
            }
            else {
                _options[param] = options[param];
            }
        }
        var tirePoints = [];
        var hubcapPoints = [];
        var hubcapSize = _options.hubcapSize;
        var wheelDepth = _options.depth;
        var quality = _options.quality;
        var tireMat = _options.tireMat;
        var hubcapMat = _options.hubcapMat;
        if (!tireMat) {
            let _tireMat = new StandardMaterial("Mat", scene);
            _tireMat.diffuseColor = Color3.FromHexString('#4D4D4B');
            _tireMat.emissiveColor = _tireMat.diffuseColor.scale(0.15);
            _tireMat.specularColor = Color3.BlackReadOnly;
            tireMat = _tireMat;
        }
        if (!hubcapMat) {
            let _hubcapMat = new StandardMaterial("Mat", scene);
            _hubcapMat.diffuseColor = Color3.FromHexString('#E0E0DB');
            _hubcapMat.emissiveColor = _hubcapMat.diffuseColor.scale(0.15);
            hubcapMat = _hubcapMat;
        }
        for (var i = 0; i < quality - 1; i++) {
            let r = i / (quality - 1) * (Math.PI * 2);
            let x = Math.sin(r) * _options.radius;
            let y = Math.cos(r) * _options.radius;
            let z = 0;
            tirePoints.unshift(x, y, z);
            hubcapPoints.unshift(x * hubcapSize, y * hubcapSize, z * hubcapSize);
        }
        var positions = [];
        var indices = [];
        var normals = [];
        var uvs = [];
        for (let i = 0; i < hubcapPoints.length; i += 3) {
            positions.push(hubcapPoints[i + 0], hubcapPoints[i + 1], hubcapPoints[i + 2] - wheelDepth / 2);
        }
        for (let i = 0; i < tirePoints.length; i += 3) {
            positions.push(tirePoints[i + 0], tirePoints[i + 1], tirePoints[i + 2] - wheelDepth / 2);
        }
        for (let i = 0; i < tirePoints.length; i += 3) {
            positions.push(tirePoints[i + 0], tirePoints[i + 1], tirePoints[i + 2] + wheelDepth / 2);
        }
        for (let i = 0; i < hubcapPoints.length; i += 3) {
            positions.push(hubcapPoints[i + 0], hubcapPoints[i + 1], hubcapPoints[i + 2] + wheelDepth / 2);
        }
        quality--;
        for (let i = 1; i < 4; i++) {
            for (let j = i * quality + 1; j < i * quality + quality; j++) {
                indices.push(j - 1 - quality, j - 1, j);
                indices.push(j, j - quality, j - 1 - quality);
            }
        }
        for (let i = 1; i < 4; i++) {
            let j = i * quality + quality - 1;
            indices.push(j - quality, j, i * quality);
            indices.push(i * quality, (i - 1) * quality, j - quality);
        }
        uvs.length = positions.length / 3 * 2;
        uvs.fill(0);
        VertexData.ComputeNormals(positions, indices, normals);
        var vertexData = new VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        var tireMesh = new Mesh("custom", scene);
        vertexData.applyToMesh(tireMesh);
        tireMesh.material = tireMat;
        var positions = [];
        var indices = [];
        var normals = [];
        var uvs = [];
        uvs.push(0, 0);
        positions.push(0, 0, -wheelDepth / 2);
        for (let i = 0; i < hubcapPoints.length; i += 3) {
            positions.push(hubcapPoints[i + 0], hubcapPoints[i + 1], hubcapPoints[i + 2] - wheelDepth / 2);
            uvs.push(0, 0);
        }
        for (let i = 2; i <= quality; i++) {
            indices.push(0, i - 1, i);
        }
        indices.push(0, quality, 1);
        for (let i = 0; i < hubcapPoints.length / 3 + 3; i++) {
            normals.push(0, 0, -1);
        }
        let indicesOffset = positions.length / 3;
        uvs.push(0, 0);
        positions.push(0, 0, wheelDepth / 2);
        for (let i = 0; i < hubcapPoints.length; i += 3) {
            positions.push(hubcapPoints[i + 0], hubcapPoints[i + 1], hubcapPoints[i + 2] + wheelDepth / 2);
            uvs.push(0, 0);
        }
        for (let i = 2; i <= quality; i++) {
            indices.push(indicesOffset + i, indicesOffset + i - 1, indicesOffset + 0);
        }
        indices.push(indicesOffset + 1, indicesOffset + quality, indicesOffset);
        for (let i = 0; i < hubcapPoints.length / 3 + 3; i++) {
            normals.push(0, 0, -1);
        }
        var vertexData = new VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        var hubcapMesh = new Mesh("custom", scene);
        vertexData.applyToMesh(hubcapMesh);
        hubcapMesh.material = hubcapMat;
        var merged = Mesh.MergeMeshes([tireMesh, hubcapMesh], true, undefined, undefined, undefined, true);
        merged.name = name;
        return merged;
    }
}
