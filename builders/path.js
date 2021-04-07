import { Mesh, MeshBuilder, StandardMaterial, Vector3 } from "@babylonjs/core";
export var LowPolyPathBuilderVersion;
(function (LowPolyPathBuilderVersion) {
    LowPolyPathBuilderVersion[LowPolyPathBuilderVersion["V1"] = 0] = "V1";
})(LowPolyPathBuilderVersion || (LowPolyPathBuilderVersion = {}));
export class LowPolyPathBuilder {
    static GetDefaultOptions(version = LowPolyPathBuilderVersion.V1) {
        switch (version) {
            case LowPolyPathBuilderVersion.V1:
                return {
                    version: LowPolyPathBuilderVersion.V1,
                    path: null,
                    width: 1,
                    height: 0,
                    material: null
                };
            default:
                return LowPolyPathBuilder.GetDefaultOptions(LowPolyPathBuilderVersion.V1);
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
            defaultOptions = LowPolyPathBuilder.GetDefaultOptions(options ? options.version : undefined);
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
     * Creates a low-poly path mesh
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the path, defaults to `LowPolyPathBuilder.GetDefaultOptions(LowPolyPathBuilderVersion.V1)`
     * @returns a low-poly path mesh
     */
    static CreatePath(name, scene, options = {}) {
        let _options = LowPolyPathBuilder.GetOptions(options);
        if (!_options.path) {
            _options.path = [new Vector3(0, 0, 0), new Vector3(0, 0, 1)];
        }
        if (!_options.material) {
            _options.material = new StandardMaterial(name + '_mat', scene);
        }
        if (!_options.width) {
            _options.width = 0;
        }
        if (!_options.height) {
            _options.height = 0;
        }
        let mesh;
        let shape;
        if (_options.height <= 0) {
            shape = [new Vector3(_options.width / 2, 0, 0), new Vector3(-_options.width / 2, 0, 0)];
        }
        else {
            shape = [new Vector3(-_options.width / 2, 0, 0), new Vector3(-_options.width / 2, _options.height, 0), new Vector3(_options.width / 2, _options.height, 0), new Vector3(_options.width / 2, 0, 0)];
        }
        mesh = MeshBuilder.ExtrudeShapeCustom(name, { shape: shape, path: _options.path, ribbonCloseArray: true, sideOrientation: Mesh.BACKSIDE }, scene);
        mesh.convertToFlatShadedMesh();
        mesh.material = _options.material;
        return mesh;
    }
}
