import { between } from "@vuelidate/validators";
import { helpers } from "@vuelidate/validators";
import { required} from "@vuelidate/validators";

class ValidationStockRules {
   
    static quantityRules() {
        return {
            required: helpers.withMessage("Hey ingresa solo números!", required),
            between: helpers.withMessage(
                "Hey ingresa solo números!",
                between(1, 10000000)
            ),
        };
    }
}

export default ValidationStockRules;
