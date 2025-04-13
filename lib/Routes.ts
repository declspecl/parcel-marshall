export enum RouteName {
    Index = "index",
    Route = "route",
    Settings = "settings"
}

export enum RouteLabel {
    Home = "Home",
    Route = "Route",
    Settings = "Settings"
}

export const routes: Record<RouteName, RouteLabel> = {
    [RouteName.Index]: RouteLabel.Home,
    [RouteName.Route]: RouteLabel.Route,
    [RouteName.Settings]: RouteLabel.Settings
};
