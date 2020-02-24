import { AlertType } from './alert-type.enum';

export interface DynamicAlert {
    id?: number;
    type: AlertType;
    msg: string;
    params?: any;
    timeout?: number;
    i18n?: boolean;
    close?: () => void;
}
