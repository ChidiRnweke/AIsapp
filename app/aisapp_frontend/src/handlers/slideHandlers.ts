export interface SlideHandler {
    validate(): boolean;
}

export interface SliderInterface {
    validatorType: string;
    showNext(): void;
    showPrevious(): void;
}


class BasicSlideHandler implements SlideHandler {

    validate(): boolean {
        return true;
    }
}


export const getSlideHandler = (slider: SliderInterface): SlideHandler => {
    switch (slider.validatorType) {
        case 'basic':
            return new BasicSlideHandler();
        default:
            throw new Error(`There is no handler available for actionType = ${slider.validatorType}`)
    }
}