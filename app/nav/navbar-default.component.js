"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const global_settings_service_1 = require("../services/global-settings.service");
const nav_service_1 = require("../services/nav.service");
require("../Scripts/custom/headerShowHide");
let NavBarDefaultComponent = class NavBarDefaultComponent {
    constructor(globalService, navigationService) {
        this.globalService = globalService;
        this.navigationService = navigationService;
    }
    ngOnInit() {
        this.branding = this.globalService;
        this.nav = this.navigationService.getNavs();
        this.cat = this.navigationService.getCats();
        this.social = this.navigationService.getSocials();
    }
};
NavBarDefaultComponent = __decorate([
    core_1.Component({
        selector: 'nav-bar-default',
        templateUrl: 'app/nav/navbar-default.component.html',
        styles: []
    }),
    __metadata("design:paramtypes", [global_settings_service_1.GlobalService, nav_service_1.NavigationService])
], NavBarDefaultComponent);
exports.NavBarDefaultComponent = NavBarDefaultComponent;
//# sourceMappingURL=navbar-default.component.js.map