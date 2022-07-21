"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const profileController_1 = __importDefault(require("../controller/profileController"));
const auth_1 = __importDefault(require("../middleware/auth"));
router.get('/profile', auth_1.default, profileController_1.default.getProfile);
router.post('/profile', auth_1.default, profileController_1.default.setProfile);
exports.default = router;
