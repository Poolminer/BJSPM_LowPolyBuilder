import { Material } from '@babylonjs/core/Materials/material';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Scene } from '@babylonjs/core/scene';
export interface LowPolyWheelCreationOptionsV1 {
    version?: LowPolyWheelBuilderVersion;
    type?: LowPolyWheelType;
    radius?: number;
    depth?: number;
    hubcapSize?: number;
    quality?: number;
    tireMat?: Material;
    hubcapMat?: Material;
}
declare type LowPolyWheelCreationOptions = LowPolyWheelCreationOptionsV1;
export declare enum LowPolyWheelBuilderVersion {
    V1 = 0
}
export declare enum LowPolyWheelType {
    CAR = 0
}
export declare class LowPolyWheelBuilder {
    static GetDefaultOptions(version?: LowPolyWheelBuilderVersion): LowPolyWheelCreationOptions;
    /**
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the wheel, defaults to `LowPolyWheelBuilder.GetDefaultOptions(LowPolyWheelBuilderVersion.V1)`
     * @returns a low-poly wheel
     */
    static CreateWheel(name: string, scene: Scene, options?: LowPolyWheelCreationOptionsV1): Mesh;
}
export {};
