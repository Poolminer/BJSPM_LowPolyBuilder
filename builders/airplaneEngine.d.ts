import { Material, Mesh, Scene } from "@babylonjs/core";
export interface LowPolyAirplaneEngineCreationOptionsV1 {
    version?: LowPolyAirplaneEngineBuilderVersion;
    scale?: number;
    length?: number;
    angle?: number;
    bodyMaterial?: Material;
    innardMaterial?: Material;
    ringMaterial?: Material;
}
export declare type LowPolyAirplaneEngineCreationOptions = LowPolyAirplaneEngineCreationOptionsV1;
export declare enum LowPolyAirplaneEngineBuilderVersion {
    V1 = 0
}
export declare class LowPolyAirplaneEngineBuilder {
    static GetDefaultOptions(version?: LowPolyAirplaneEngineBuilderVersion): LowPolyAirplaneEngineCreationOptions;
    /**
     * Creates a new options object by combining the provided `options` object with missing parameters from the provided `defaultOptions` object.
     *
     * @param options the (incomplete) options
     * @param defaultOptions the options to take parameters from
     * @returns the new options object
     */
    static GetOptions(options?: LowPolyAirplaneEngineCreationOptions, defaultOptions?: LowPolyAirplaneEngineCreationOptions): LowPolyAirplaneEngineCreationOptionsV1;
    /**
     * Creates a low-poly airplane engine mesh
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the engine, defaults to `LowPolyAirplaneEngineBuilder.GetDefaultParams(LowPolyAirplaneEngineBuilderVersion.V1)`
     * @returns a low-poly engine mesh
     */
    static CreateEngine(name: string, scene: Scene, options?: LowPolyAirplaneEngineCreationOptionsV1): Mesh;
}
