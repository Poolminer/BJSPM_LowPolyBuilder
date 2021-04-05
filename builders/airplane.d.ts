import { Mesh, Scene } from "@babylonjs/core";
import { Material } from "@babylonjs/core/Materials/material";
import { LowPolyAirplaneEngineCreationOptions } from './airplaneEngine';
import { LowPolyAirplaneWingCreationOptions } from './airplaneWing';
export interface LowPolyAirplaneCreationOptionsV1 {
    version?: LowPolyAirplaneBuilderVersion;
    enginesPerWing?: number;
    bodyType?: LowPolyAirplaneBody;
    bodyMaterial?: Material;
    finMaterial?: Material;
    mainWingsCreationOptions?: LowPolyAirplaneWingCreationOptions;
    tailWingsCreationOptions?: LowPolyAirplaneWingCreationOptions;
    engineCreationOptions?: LowPolyAirplaneEngineCreationOptions;
    engineHolderWidth?: number;
    engineHolderHeight?: number;
    engineHolderDepth?: number;
    engineHolderSkewing?: number;
}
export declare type LowPolyAirplaneCreationOptions = LowPolyAirplaneCreationOptionsV1;
export declare enum LowPolyAirplaneBuilderVersion {
    V1 = 0
}
export declare enum LowPolyAirplaneBody {
    B747 = 0,
    A380_STRETCH = 1
}
export declare enum LowPolyAirplaneParts {
    BODY = 0,
    MAIN_WING_LEFT = 1,
    MAIN_WING_RIGHT = 2,
    TAIL_WING_LEFT = 3,
    TAIL_WING_RIGHT = 4,
    TAIL_WING_TOP = 5,
    ENGINE = 6,
    ENGINE_HOLDER = 7
}
export declare class LowPolyAirplaneBuilder {
    static GetDefaultOptions(version?: LowPolyAirplaneBuilderVersion): LowPolyAirplaneCreationOptions;
    /**
     * Creates a new options object by combining the provided `options` object with missing parameters from the provided `defaultOptions` object.
     *
     * @param options the (incomplete) options
     * @param defaultOptions the options to take parameters from
     * @returns the new options object
     */
    static GetOptions(options?: LowPolyAirplaneCreationOptions, defaultOptions?: LowPolyAirplaneCreationOptions): LowPolyAirplaneCreationOptionsV1;
    /**
     * Creates a low-poly airplane
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the airplane, defaults to `LowPolyAirplaneBuilder.GetDefaultOptions(LowPolyAirplaneBuilderVersion.V1)`
     * @param mergeExcludes which parts of the airplane not to merge into one mesh, as in `LowPolyAirplaneParts`
     * @returns a low-poly airplane
     */
    static CreateAirplane(name: string, scene: Scene, options?: LowPolyAirplaneCreationOptionsV1, mergeExcludes?: LowPolyAirplaneParts[]): Mesh;
}
