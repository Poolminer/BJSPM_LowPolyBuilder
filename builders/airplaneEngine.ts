import { Material, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

export interface LowPolyAirplaneEngineCreationOptionsV1 {
    version?: LowPolyAirplaneEngineBuilderVersion,
    scale?: number,
    length?: number,
    angle?: number,
    bodyMaterial?: Material,
    innardMaterial?: Material,
    ringMaterial?: Material
}
export type LowPolyAirplaneEngineCreationOptions = LowPolyAirplaneEngineCreationOptionsV1;

export enum LowPolyAirplaneEngineBuilderVersion {
    V1
}

export class LowPolyAirplaneEngineBuilder {

    public static GetDefaultOptions(version = LowPolyAirplaneEngineBuilderVersion.V1): LowPolyAirplaneEngineCreationOptions {
        switch (version) {
            case LowPolyAirplaneEngineBuilderVersion.V1:
                return {
                    version: LowPolyAirplaneEngineBuilderVersion.V1,
                    scale: 1,
                    length: 1,
                    angle: 0,
                    bodyMaterial: null,
                    innardMaterial: null,
                    ringMaterial: null
                };
            default:
                return LowPolyAirplaneEngineBuilder.GetDefaultOptions(LowPolyAirplaneEngineBuilderVersion.V1);
        }
    }

    /**
     * Creates a new options object by combining the provided `options` object with missing parameters from the provided `defaultOptions` object.
     * 
     * @param options the (incomplete) options
     * @param defaultOptions the options to take parameters from
     * @returns the new options object
     */
    public static GetOptions(options?: LowPolyAirplaneEngineCreationOptions, defaultOptions?: LowPolyAirplaneEngineCreationOptions) {
        let _options = {} as LowPolyAirplaneEngineCreationOptions;

        if (!options) {
            options = {};
        }
        if (!defaultOptions) {
            defaultOptions = LowPolyAirplaneEngineBuilder.GetDefaultOptions(options ? options.version : undefined);
        }
        for (let param in defaultOptions) {
            if (options[param] === undefined) {
                _options[param] = defaultOptions[param];
            } else {
                _options[param] = options[param];
            }
        }
        return _options;
    }

    /**
     * Creates a low-poly airplane engine mesh
     * 
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the engine, defaults to `LowPolyAirplaneEngineBuilder.GetDefaultParams(LowPolyAirplaneEngineBuilderVersion.V1)`
     * @returns a low-poly engine mesh
     */
    public static CreateEngine(name: string, scene: Scene, options = {} as LowPolyAirplaneEngineCreationOptions) {
        let _options = LowPolyAirplaneEngineBuilder.GetOptions(options);

        if (_options.bodyMaterial === null) {
            let mat = new StandardMaterial('mat', scene);

            _options.bodyMaterial = mat;
        }

        if (_options.ringMaterial === null) {
            let mat = new StandardMaterial('mat', scene);

            _options.ringMaterial = mat;
        }

        if (_options.innardMaterial === null) {
            let mat = new StandardMaterial('mat', scene);

            _options.innardMaterial = mat;
        }

        let bodyPoints2D = [401, 231, 309, 202, 396, 179, 482, 167, 614, 161, 720, 165, 810, 180];
        let bodyPoints = [];
        let scale = 0.01;

        for (let i = 0; i < bodyPoints2D.length; i += 2) {
            bodyPoints.push(new Vector3(bodyPoints2D[i + 0] * scale, -bodyPoints2D[i + 1] * scale, 0));
        }
        let center = Vector3.Zero();

        for (let point of bodyPoints) {
            center.addInPlace(point);
        }
        center.scaleInPlace(1 / bodyPoints.length);

        for (let point of bodyPoints) {
            point.subtractInPlace(center);
        }
        let bodyPath = [];
        let numBodyPathPoints = 13;

        for (let i = 0; i < numBodyPathPoints; i++) {
            let div = i / (numBodyPathPoints - 1);
            let rad = div * Math.PI * 2;

            bodyPath.push(new Vector3(0, Math.sin(rad), Math.cos(rad)));
        }

        let ringPoints2D = [810, 180, 825, 182, 836, 188, 840, 192, 840, 201, 832, 211, 821, 215, 810, 217];
        let ringPoints = [];
        scale = 0.01;

        for (let i = 0; i < ringPoints2D.length; i += 2) {
            ringPoints.push(new Vector3(ringPoints2D[i + 0] * scale, -ringPoints2D[i + 1] * scale, 0));
        }
        center = Vector3.Zero();

        for (let point of ringPoints) {
            center.addInPlace(point);
        }
        center.scaleInPlace(1 / ringPoints.length);

        for (let point of ringPoints) {
            point.subtractInPlace(center);
        }
        let ringPath = [];
        let numRingPathPoints = 13;

        for (let i = 0; i < numRingPathPoints; i++) {
            let div = i / (numRingPathPoints - 1);
            let rad = div * Math.PI * 2;

            ringPath.push(new Vector3(0, Math.sin(rad), Math.cos(rad)));
        }

        let body = MeshBuilder.ExtrudeShapeCustom('body', { shape: bodyPoints, path: bodyPath, ribbonCloseArray: true, sideOrientation: Mesh.DOUBLESIDE }, scene);
        let ring = MeshBuilder.ExtrudeShapeCustom('ring', { shape: ringPoints, path: ringPath, ribbonCloseArray: true, sideOrientation: Mesh.DOUBLESIDE }, scene);
        let innard = MeshBuilder.CreateCylinder('cone', { height: 4, diameterTop: 0, diameterBottom: 2 }, scene);

        innard.rotation.z = -Math.PI / 2;
        innard.position.x = 1.8;
        ring.position.x = -2.9;
        ring.scaling.scaleInPlace(0.88);

        body.material = _options.bodyMaterial;
        innard.material = _options.innardMaterial;
        ring.material = _options.ringMaterial;

        let eng = Mesh.MergeMeshes([body, ring, innard], true, undefined, undefined, undefined, true);
        eng.name = name;
        eng.computeWorldMatrix();

        eng.scaling.scaleInPlace(_options.scale);
        eng.scaling.x *= _options.length;
        eng.bakeCurrentTransformIntoVertices();

        let bi = eng.getBoundingInfo();
        eng.position.y -= bi.boundingBox.extendSize.y;
        eng.rotation.x = _options.angle;

        eng.bakeCurrentTransformIntoVertices();

        return eng;
    }

}