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
let GalleryCtaComponent = class GalleryCtaComponent {
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GalleryCtaComponent.prototype, "category", void 0);
GalleryCtaComponent = __decorate([
    core_1.Component({
        selector: 'gallery-cta',
        template: `
                <button class="btn btn-default category-cta">{{ category?.name }}</button>
      
        
    `
    }),
    __metadata("design:paramtypes", [])
], GalleryCtaComponent);
exports.GalleryCtaComponent = GalleryCtaComponent;
//# sourceMappingURL=gallery-cta.component.js.map