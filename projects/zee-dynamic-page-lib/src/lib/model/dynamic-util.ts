import { Theme } from './theme.enum';


export class DynamicUtil {
    
    constructor() {}
    
    public static buttonThemeFor(theme: Theme): string {
        return DynamicUtil.themeFor('btn-', theme);
    }

    public static textThemeFor(theme: Theme): string {
        return DynamicUtil.themeFor('text-', theme);
    }

    public static borderThemeFor(theme: Theme): string {
        return DynamicUtil.themeFor('border-', theme);
    }

    public static bgThemeFor(theme: Theme): string {
        return DynamicUtil.themeFor('bg-gradient-', theme);
    }

    public static themeFor(prefix: string, theme: Theme): string {
        switch (theme) {
            case Theme.danger:
                return `${prefix}danger`;
            case Theme.primary:
                return `${prefix}primary`;
            case Theme.info:
                return `${prefix}info`;
            case Theme.light:
                return `${prefix}light`;
            case Theme.secondary:
                return `${prefix}secondary`;
            case Theme.success:
                return `${prefix}success`;
            case Theme.warning:
                return `${prefix}warning`;
            default:
                return `${prefix}dark`;
        }
    }

    public static getEnumOf<E>(enumType: object, key: string | number): E {
        return enumType[key] as E;
    }

    public static getEnumKeyValuePairs(enumType: object): Array<{ key: string; value: string | number }> {
        const keys = DynamicUtil.getEnumKeys(enumType).map(key => {
            return { key, value: enumType[key] };
        });
        return keys;
    }

    public static getEnumValues(enumType: object): Array<string | number> {
        const vals = DynamicUtil.getEnumKeyValuePairs(enumType).map(kv => kv.value);
        return vals;
    }

    public static getEnumKeys(enumType: object): Array<string> {
        const members = Object.keys(enumType);
        let keys: string[];
        if (!DynamicUtil.isNumericEnum(enumType)) {
            keys = members;
        } else {
            keys = [];
            members.forEach(x => {
                const parsedValue = parseInt(x, 10);
                if (Number.isNaN(parsedValue)) {
                    keys.push(x);
                }
            });
        }
        // key of enumeration can't be number
        return keys.filter(x => Number.isNaN(parseInt(x, 10)));
    }

    public static isNumericEnum(enumType: object) {
        const members = Object.keys(enumType);
        if (!members.some(x => true)) {
            throw new TypeError('Invalid enumeration type.');
        }
        let parsedCount = 0;
        members.forEach(x => {
            const parsedValue = parseInt(x, 10);
            if (!Number.isNaN(parsedValue)) {
                parsedCount++;
            }
        });
        return parsedCount === members.length / 2;
    }

}
