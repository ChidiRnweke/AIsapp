import { getElementOrThrow } from "../utils/utils.js";
import { FormGroupInterface } from "../handlers/formHandlers.js";
import { Page } from "./utils.js";


type DayPrefs = Map<string, string>;

const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
const weekends = ["saturday", "sunday"] as const;
const presets = ["week-time", "weekend-time"] as const;

export const setupPage: Page = {
    templateId: "setup",
    onRender: () => {
        const slider = getElementOrThrow<HTMLElement>(document, "sequential-slider");
        const nextButton = getElementOrThrow<HTMLButtonElement>(slider.shadowRoot!, "#next");

        nextButton.addEventListener('click', () => {
            const dayPrefs = getPreferences(presets);
            const weekPrefs = dayPrefs.get("week-time");
            const weekendPrefs = dayPrefs.get("weekend-time");

            if (weekPrefs === undefined || weekendPrefs === undefined) {
                throw Error("Did not find a preset object.")
            }

            setDayPreferences(weekdays, weekPrefs);
            setDayPreferences(weekends, weekendPrefs);

        })
    }
}

const getPreferences = (days: readonly string[]): DayPrefs => {
    const dayPreferences = new Map();
    for (const day of days) {
        const day_of_week = getElementOrThrow<FormGroupInterface>(document, `#${day}`)
        dayPreferences.set(day, day_of_week.getInputValue());
    }
    return dayPreferences;

}

const setDayPreferences = (days: readonly string[], presets: string): void => {
    days.forEach(day => {
        const dayElem = getElementOrThrow<FormGroupInterface>(document, `#${day}`);
        dayElem.setInputValue(presets);
        const inputEvent = new Event('input');
        dayElem.dispatchEvent(inputEvent);
    })
}