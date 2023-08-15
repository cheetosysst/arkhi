declare module 'virtual:contents' {
    import { Content } from "./cms";
    const contents: Content;
    export default contents;
}
// declare module "virtual:island" {
//     import { ComponentType } from "react";
//     export type IslandProps = { _island_id: string };
//     export const IslandMap: Map<string, ComponentType<any>>;
//     export function Island<T extends object>(
//         Component: ComponentType<T & IslandProps>
//     ): ComponentType<T>;
//     export function getComponentFromIslandMap(componentName: string): ComponentType<any>;
// }
// declare module "virtual:island" {
//     import { ComponentType } from "react";
//     import { IslandProps, Island } from "@/arkhi/client/island";

//     export { IslandProps, IslandMap, Island };
// }

