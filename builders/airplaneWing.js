import { Mesh, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
export var LowPolyAirplaneWingBuilderVersion;
(function (LowPolyAirplaneWingBuilderVersion) {
    LowPolyAirplaneWingBuilderVersion[LowPolyAirplaneWingBuilderVersion["V1"] = 0] = "V1";
})(LowPolyAirplaneWingBuilderVersion || (LowPolyAirplaneWingBuilderVersion = {}));
export class LowPolyAirplaneWingBuilder {
    static GetDefaultOptions(version = LowPolyAirplaneWingBuilderVersion.V1) {
        switch (version) {
            case LowPolyAirplaneWingBuilderVersion.V1:
                return {
                    version: LowPolyAirplaneWingBuilderVersion.V1,
                    width: 1.4,
                    height: 0.061,
                    length: 4,
                    yaw: Math.PI / 8,
                    pitch: 0,
                    falloff: 0.3,
                    right: false,
                    wingShape: null,
                    material: null
                };
            default:
                return LowPolyAirplaneWingBuilder.GetDefaultOptions(LowPolyAirplaneWingBuilderVersion.V1);
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
            defaultOptions = LowPolyAirplaneWingBuilder.GetDefaultOptions(options ? options.version : undefined);
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
     * Creates a low-poly airplane wing
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the wing, defaults to `LowPolyAirplaneWingBuilder.GetDefaultOptions(LowPolyAirplaneWingBuilderVersion.V1)`
     * @returns a low-poly airplane wing
     */
    static CreateWing(name, scene, options = {}) {
        let _options = LowPolyAirplaneWingBuilder.GetOptions(options);
        if (_options.falloff < 0) {
            _options.falloff = 0;
        }
        else if (_options.falloff > 1) {
            _options.falloff = 1;
        }
        if (_options.material === null) {
            let mat = new StandardMaterial('mat', scene);
            _options.material = mat;
        }
        let x = _options.width / 2;
        let y = _options.height;
        if (!_options.wingShape) {
            _options.wingShape = [
                new Vector3(-x, -y, 0),
                new Vector3(-x, -y + y * 0.5, 0),
                new Vector3(x * 0.8, y * 2, 0),
                new Vector3(x, y, 0),
                new Vector3(x * 1.05, 0, 0),
                new Vector3(x, -y, 0),
                new Vector3(-x, -y, 0)
            ];
        }
        let wingPath = [];
        let wingLength = _options.length;
        let numWingPoints = 2;
        for (let i = 0; i < numWingPoints; i++) {
            wingPath.push(new Vector3(0, 0, i / (numWingPoints - 1) * wingLength));
        }
        let wingScaleFn = function (index) {
            let div = index / (numWingPoints - 1);
            return div + (1 - div) * _options.falloff;
        };
        let wingMesh = MeshBuilder.ExtrudeShapeCustom('wing', { shape: _options.wingShape, path: wingPath, scaleFunction: wingScaleFn, cap: Mesh.CAP_START, sideOrientation: Mesh.DOUBLESIDE }, scene);
        wingMesh.position.x = -x;
        wingMesh.position.z -= wingLength;
        wingMesh.bakeCurrentTransformIntoVertices();
        wingMesh.rotation.y = Math.PI + _options.yaw;
        wingMesh.bakeCurrentTransformIntoVertices();
        wingMesh.rotation.z += _options.pitch;
        if (!_options.right) {
            wingMesh.scaling.z = -1;
        }
        wingMesh.bakeCurrentTransformIntoVertices();
        wingMesh.material = _options.material;
        wingMesh.name = name;
        return wingMesh;
    }
}
