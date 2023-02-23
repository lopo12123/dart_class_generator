// 来源
export type SourceType = 'json' | 'ts-interface' | 'ts-type' | 'raw'

// 能转换的类型
type SupportedType = 'String' | 'bool' | 'int' | 'double' | 'dynamic'
type ClassEntries = { name: string, type: SupportedType }[]

const transType = (v: any): SupportedType => {
    switch(typeof v) {
        case 'string':
            return 'String'
        case 'boolean':
            return 'bool'
        case 'number':
            return (v % 1 === 0) ? 'int' : 'double'
        default:
            return 'dynamic'
    }
}

const codeTemplate = (className: string, entries: ClassEntries) => {
    return `// auto generated.
import 'dart:convert';

class ${ className } {
${ entries.map(({ name, type }) => `${ type }? ${ name };`).join('\n') }

  ${ className }({
${ entries.map(({ name }) => `this.${ name },`).join('\n') }
  });

  ${ className }.fromMap(Map map) {
${ entries.map(({ name }) => `${ name } = map['${ name }'];`).join('\n') }
  }

  ${ className }.fromJson(String json) {
    Map map = {};

    try {
      map = jsonDecode(json);
    } catch (err) {
      print('invalid json. $err');
    }
    
    ${ className }.fromMap(map);
  }

  Map toMap() {    
    return {
${ entries.map(({ name }) => `'${ name }': ${ name },`).join('\n') }
    };
  }

  String toJson() {
    return jsonEncode(toMap());
  }
}
`
}

abstract class DartClassGenerator {
    private static fromJson(source: string, className: string = 'TemplateClass') {
        try {
            const obj = JSON.parse(source)
            if(!(obj instanceof Object)) return 'TypeError'

            const entries: ClassEntries = Object.entries(obj)
                .map(([ key, val ]) => ({ name: key, type: transType(val) }))
            return codeTemplate(className, entries)
        } catch (err) {
            console.log('[fromJson]: ', err)
            return 'Internal Error'
        }
    }

    private static fromTsInterface(source: string, className: string = 'TemplateClass') {
        return 'TODO: [fromTsInterface]'
    }

    private static fromTsType(source: string, className: string = 'TemplateClass') {
        return 'TODO: [fromTsType]'
    }

    private static fromRaw(source: string, className: string = 'TemplateClass') {
        return 'TODO: [fromRaw]'
    }

    public static parse(sourceType: SourceType, source: string, className: string = 'TemplateClass') {
        switch(sourceType) {
            case 'json':
                return DartClassGenerator.fromJson(source, className)
            case 'ts-interface':
                return DartClassGenerator.fromTsInterface(source, className)
            case 'ts-type':
                return DartClassGenerator.fromTsType(source, className)
            case 'raw':
                return DartClassGenerator.fromRaw(source, className)
            default:
                return 'Never'
        }
    }
}

export {
    DartClassGenerator
}
