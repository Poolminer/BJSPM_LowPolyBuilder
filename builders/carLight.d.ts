import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
export interface LowPolyCarLightCreationOptionsV1 {
    version?: LowPolyCarLightBuilderVersion;
    numSides?: number;
    radius?: number;
    depth?: number;
    rotation?: number;
}
declare type LowPolyCarLightCreationOptions = LowPolyCarLightCreationOptionsV1;
export declare enum LowPolyCarLightBuilderVersion {
    V1 = 0
}
export declare class LowPolyCarLightBuilder {
    static GetDefaultOptions(version?: LowPolyCarLightBuilderVersion): LowPolyCarLightCreationOptions;
    /**
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the light, defaults to `LowPolyCarLightBuilder.GetDefaultOptions(LowPolyCarLightBuilderVersion.V1)`
     * @returns a low-poly car light mesh
     */
    static CreateLight(name: string, scene: Scene, options?: LowPolyCarLightCreationOptionsV1): Mesh;
}
export {};
