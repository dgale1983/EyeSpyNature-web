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
let NavBarComponent = class NavBarComponent {
    constructor(globalService, navigationService) {
        this.globalService = globalService;
        this.navigationService = navigationService;
        this.isIn = false;
    }
    toggleState() {
        let bool = this.isIn;
        this.isIn = bool === false ? true : false;
    }
    ngOnInit() {
        this.branding = this.globalService;
        this.nav = this.navigationService.getNavs();
        this.cat = this.navigationService.getCats();
        this.social = this.navigationService.getSocials();
    }
};
NavBarComponent = __decorate([
    core_1.Component({
        selector: 'nav-bar',
        templateUrl: 'app/nav/navbar.component.html',
        styles: []
    }),
    __metadata("design:paramtypes", [global_settings_service_1.GlobalService, nav_service_1.NavigationService])
], NavBarComponent);
exports.NavBarComponent = NavBarComponent;
//# sourceMappingURL=navbar.component.js.map