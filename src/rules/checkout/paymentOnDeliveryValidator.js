import ValidationRules from "@/rules/ValidationRules.js";

export const rules = {
    name: ValidationRules.nameRules(),
    phone_number: ValidationRules.phoneNumberRules(),
    street: ValidationRules.streetRules(),

};