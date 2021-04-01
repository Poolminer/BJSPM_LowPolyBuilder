import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Scene } from '@babylonjs/core/scene';
export interface LowPolyCarBuilderOptionsV1 {
    version?: LowPolyCarBuilderVersion;
    randomFn?: () => number; /** The random number generator, defaults to `Math.random` */
    maxHoodOffset?: number;
    maxBackSeatOffset?: number;
    lightSize?: number;
    globalColorMultiplier?: number; /** All colors get multiplied by this value */
    bodyColor?: string;
    bodyColorMultiplier?: number; /** How desaturated the provided body color should be made */
    colorEmission?: number; /** How emissive the colors are */
    width?: number;
    windowColor?: string;
    licensePlateColor?: string;
    licensePlateType?: LowPolyLicensePlateType;
    frontLightsColor?: string;
    tailLightsColor?: string;
    tireColor?: string;
    wheelHubcapColor?: string;
}
declare type LowPolyCarBuilderOptions = LowPolyCarBuilderOptionsV1;
export interface LowPolyLicensePlateType {
    size: number;
    ratio: number;
}
export declare enum LowPolyCarParts {
    WHEEL_FRONT_LEFT = 0,
    WHEEL_FRONT_RIGHT = 1,
    WHEEL_REAR_LEFT = 2,
    WHEEL_REAR_RIGHT = 3,
    LIGHT_HEAD_LEFT = 4,
    LIGHT_HEAD_RIGHT = 5,
    LIGHT_TAIL_LEFT = 6,
    LIGHT_TAIL_RIGHT = 7,
    LICENSE_PLATE_FRONT = 8,
    LICENSE_PLATE_REAR = 9
}
export declare enum LowPolyCarBuilderVersion {
    V1 = 0
}
export declare const LowPolyLicensePlateTypes: {
    EU: LowPolyLicensePlateType;
    US: LowPolyLicensePlateType;
};
export declare class LowPolyCarBuilder {
    static GetDefaultOptions(version?: LowPolyCarBuilderVersion): LowPolyCarBuilderOptions;
    /**
     * Creates a low-poly car mesh
     *
     * @param name the name of the mesh
     * @param scene the hosting scene
     * @param options the options for creating the car, defaults to `LowPolyCarBuilder.GetDefaultParams(LowPolyCarBuilderVersion.V1)`
     * @param mergeExcludes which parts of the car not to merge into one mesh, as in `LowPolyCarParts`
     * @returns a low-poly car mesh
     */
    static CreateCar(name: string, scene: Scene, options?: LowPolyCarBuilderOptionsV1, mergeExcludes?: LowPolyCarParts[]): Mesh;
}
export {};
