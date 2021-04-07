import { Material, Mesh, Scene, Vector3 } from "@babylonjs/core";
export interface LowPolyPathCreationOptionsV1 {
    version?: LowPolyPathBuilderVersion;
    path?: Vector3[];
    width?: number;
    height?: number;
    material?: Material;
}
export declare type LowPolyPathCreationOptions = LowPolyPathCreationOptionsV1;
export declare enum LowPolyPathBuilderVersion {
    V1 = 0
}
export declare class LowPolyPathBuilder {
    static GetDefaultOptions(version?: LowPolyPathBuilderVersion): LowPolyPathCreationOptions;
    /**
     * Creates a new options object by combining the provided `options` object with missing parameters from the provided `defaultOptions` object.
     *
     * @param options the (incomplete) options
     * @param defaultOptions the options to take parameters from
     * @returns the new options object
     */
    static GetOptions(options?: LowPolyPathCreationOptions, defaultOptions?: LowPolyPathCreationOptions): LowPolyPathCreationOptionsV1;
    /**
     * Creates a low-poly path mesh
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the path, defaults to `LowPolyPathBuilder.GetDefaultOptions(LowPolyPathBuilderVersion.V1)`
     * @returns a low-poly path mesh
     */
    static CreatePath(name: string, scene: Scene, options?: LowPolyPathCreationOptionsV1): Mesh;
}
