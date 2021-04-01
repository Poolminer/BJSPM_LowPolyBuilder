import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
export var LowPolyCarLightBuilderVersion;
(function (LowPolyCarLightBuilderVersion) {
    LowPolyCarLightBuilderVersion[LowPolyCarLightBuilderVersion["V1"] = 0] = "V1";
})(LowPolyCarLightBuilderVersion || (LowPolyCarLightBuilderVersion = {}));
export class LowPolyCarLightBuilder {
    static GetDefaultOptions(version = LowPolyCarLightBuilderVersion.V1) {
        switch (version) {
            case LowPolyCarLightBuilderVersion.V1:
                return {
                    version: LowPolyCarLightBuilderVersion.V1,
                    numSides: 4,
                    radius: 0.09,
                    depth: 0.009,
                    rotation: 0
                };
            default:
                return LowPolyCarLightBuilder.GetDefaultOptions(LowPolyCarLightBuilderVersion.V1);
        }
    }
    /**
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the light, defaults to `LowPolyCarLightBuilder.GetDefaultOptions(LowPolyCarLightBuilderVersion.V1)`
     * @returns a low-poly car light mesh
     */
    static CreateLight(name, scene, options = {}) {
        let _options = {};
        let defaultOptions = LowPolyCarLightBuilder.GetDefaultOptions(options.version);
        for (let param in defaultOptions) {
            if (options[param] === undefined) {
                _options[param] = defaultOptions[param];
            }
            else {
                _options[param] = options[param];
            }
        }
        let numSides = _options.numSides;
        numSides++;
        let lightPoints = [];
        for (var i = 0; i < numSides; i++) {
            let r = i / (numSides - 1) * (-Math.PI * 2) + Math.PI / (numSides - 1) + _options.rotation;
            let x = Math.sin(r) * _options.radius;
            let y = Math.cos(r) * _options.radius;
            let z = 0;
            lightPoints.push(new Vector3(x, y, z));
        }
        let path = [Vector3.ZeroReadOnly, new Vector3(0, 0, _options.depth)];
        let extrusion = MeshBuilder.ExtrudeShape(name, { shape: lightPoints, path: path, cap: Mesh.CAP_START }, scene);
        extrusion.convertToFlatShadedMesh();
        return extrusion;
    }
}
