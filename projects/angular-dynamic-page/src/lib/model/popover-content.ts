import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

export type PopoverContent = TemplateRef<any> | ComponentType<any> | string;
