import { BasePanelView } from './base-panel-view';
import { Theme } from './theme.enum';
import { PanelState } from './panel-state.enum';

export class BasePageView<T> extends BasePanelView {

    constructor() {
        super();
        this.theme = Theme.dark;
        this.panelState = PanelState.EXPANDED;
    }

    public destroy(): void {
        super.clean();
    }
}
