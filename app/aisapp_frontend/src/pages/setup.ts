import { getElementOrThrow } from "../utils/utils.js";
import { FormGroupInterface } from "../handlers/formHandlers.js";
import { Page } from "./utils.js";


export const setupPage: Page = {
    templateId: "setup",
    onRender: () => { doStuff(); return } // not implemented yet
}


type DayPrefs = Map<string, string>;
const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

const storePreferences = (days: readonly string[]): DayPrefs => {
    const dayPreferences = new Map();
    for (const day of days) {
        const day_of_week = getElementOrThrow<FormGroupInterface>(document, `#${day}`)
        dayPreferences.set(day, day_of_week.getInputValue());
    }
    return dayPreferences;

}

const doStuff = () => {
    const day_map = storePreferences(days);
    console.log(day_map);
}