export interface IDynamicConfig {
  applicationId: string | number;
  serverApiUrl?: string;
  i18nPrefix: string;
  i18nAppName?: string;
  appPathPrefix?: string;
  microserviceName?: string;
}

export class DynamicConfig {
  constructor(
      public readonly applicationId: string | number,
      public readonly serverApiUrl: string,
      public readonly i18nPrefix: string,
      public readonly i18nAppName: string,
      public readonly appPathPrefix: string,
      public readonly microserviceName: string
  ) {}
}
