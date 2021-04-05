import { Mesh } from "@babylonjs/core";
import { Material } from "@babylonjs/core/Materials/material";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
export interface LowPolyAirplaneWingCreationOptionsV1 {
    version?: LowPolyAirplaneWingBuilderVersion;
    width?: number;
    height?: number;
    length?: number;
    yaw?: number;
    pitch?: number;
    falloff?: number;
    right?: boolean;
    wingShape?: Vector3[];
    material?: Material;
}
export declare type LowPolyAirplaneWingCreationOptions = LowPolyAirplaneWingCreationOptionsV1;
export declare enum LowPolyAirplaneWingBuilderVersion {
    V1 = 0
}
export declare class LowPolyAirplaneWingBuilder {
    static GetDefaultOptions(version?: LowPolyAirplaneWingBuilderVersion): LowPolyAirplaneWingCreationOptions;
    /**
     * Creates a new options object by combining the provided `options` object with missing parameters from the provided `defaultOptions` object.
     *
     * @param options the (incomplete) options
     * @param defaultOptions the options to take parameters from
     * @returns the new options object
     */
    static GetOptions(options?: LowPolyAirplaneWingCreationOptions, defaultOptions?: LowPolyAirplaneWingCreationOptions): LowPolyAirplaneWingCreationOptionsV1;
    /**
     * Creates a low-poly airplane wing
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the wing, defaults to `LowPolyAirplaneWingBuilder.GetDefaultOptions(LowPolyAirplaneWingBuilderVersion.V1)`
     * @returns a low-poly airplane wing
     */
    static CreateWing(name: string, scene: Scene, options?: LowPolyAirplaneWingCreationOptionsV1): Mesh;
}
