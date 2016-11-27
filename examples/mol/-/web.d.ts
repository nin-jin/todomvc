declare namespace $ {
    function $mol_merge_dict<Target, Source>(target: Target, source: Source): Target & Source;
}
declare namespace $ {
    function $mol_log(path: string, values: any[]): void;
    namespace $mol_log {
        function filter(next?: string): string;
    }
}
declare namespace $ {
    class $mol_object {
        Class(): any;
        static objectPath(): any;
        'objectClassNames()': string[];
        objectClassNames(): string[];
        private 'objectOwner()';
        objectOwner(next?: {
            objectPath(): string;
        }): {
            objectPath(): string;
        };
        private 'objectField()';
        objectField(next?: string): string;
        objectPath(next?: string): string;
        setup(script: (obj: this) => void): this;
        'destroyed()': boolean;
        destroyed(next?: boolean): boolean;
        log(values: any[]): void;
        static toString(): any;
        toString(): string;
    }
}
declare namespace $ {
    class $mol_set<Value> {
        size: number;
        add(key: Value): this;
        delete(key: Value): void;
        has(key: Value): boolean;
        clear(): void;
        keys(): Value[];
        values(): Value[];
        entries(): [Value, Value][];
        forEach(handler: (key: Value, value: Value) => void): void;
    }
    class $mol_set_shim<Value> implements $mol_set<Value> {
        _index: {
            [index: string]: Value[];
        };
        size: number;
        add(value: Value): this;
        has(value: Value): boolean;
        delete(value: Value): void;
        forEach(handle: (val: Value, key: Value) => void): void;
        keys(): Value[];
        values(): Value[];
        entries(): [Value, Value][];
        clear(): void;
    }
}
declare namespace $ {
    class $mol_defer extends $mol_object {
        run: () => void;
        constructor(run: () => void);
        destroyed(next?: boolean): boolean;
        static all: $mol_defer[];
        static timer: number;
        static scheduleNative: (handler: () => void) => number;
        static schedule(): void;
        static unschedule(): void;
        static add(defer: $mol_defer): void;
        static drop(defer: $mol_defer): void;
        static run(): void;
    }
}
declare namespace $ {
    class $mol_dict<Key, Value> {
        size: number;
        get(key: Key): Value;
        set(key: Key, value: Value): this;
        delete(key: Key): void;
        has(key: Key): boolean;
        clear(): void;
        keys(): Key[];
        values(): Value[];
        entries(): [Key, Value][];
        forEach(handler: (value: Value, key: Key) => void): void;
    }
    class $mol_dict_shim<Key, Value> implements $mol_dict<Key, Value> {
        _keys: {
            [index: string]: Key[];
        };
        _values: {
            [index: string]: Value[];
        };
        size: number;
        set(key: Key, value: Value): this;
        get(key: Key): Value;
        has(key: Key): boolean;
        delete(key: Key): void;
        forEach(handle: (val: Value, key: Key) => void): void;
        keys(): Key[];
        values(): Value[];
        entries(): [Key, Value][];
        clear(): void;
    }
}
declare namespace $ {
    var $mol_state_stack: $mol_dict<string, any>;
}
declare var Proxy: any;
declare namespace $ {
    enum $mol_atom_status {
        obsolete,
        checking,
        actual,
    }
    class $mol_atom<Value> extends $mol_object {
        handler: (next?: Value | Error, prev?: Value | Error) => Value;
        fail: (host: any, error: Error) => Value | Error;
        host: {
            objectPath(): string;
            [key: string]: any;
        };
        field: string;
        key: any;
        masters: $mol_set<$mol_atom<any>>;
        slaves: $mol_set<$mol_atom<any>>;
        status: $mol_atom_status;
        autoFresh: boolean;
        'value()': Value;
        constructor(handler: (next?: Value | Error, prev?: Value | Error) => Value, fail?: (host: any, error: Error) => Value | Error, host?: {
            objectPath(): string;
            [key: string]: any;
        }, field?: string, key?: any);
        destroyed(next?: boolean): boolean;
        unlink(): void;
        objectPath(): string;
        get(): Error | Value;
        actualize(): void;
        pull(): any;
        set(next: Value | Error, prev?: Value | Error): any;
        push(next: Value | Error): Error | Value;
        obsoleteSlaves(): void;
        checkSlaves(): void;
        check(): void;
        obsolete(): Value;
        lead(slave: $mol_atom<any>): void;
        dislead(slave: $mol_atom<any>): void;
        obey(master: $mol_atom<any>): void;
        disobey(master: $mol_atom<any>): void;
        disobeyAll(): void;
        static stack: $mol_atom<any>[];
        static updating: $mol_atom<any>[];
        static reaping: $mol_set<$mol_atom<any>>;
        static scheduled: boolean;
        static actualize(atom: $mol_atom<any>): void;
        static reap(atom: $mol_atom<any>): void;
        static unreap(atom: $mol_atom<any>): void;
        static schedule(): void;
        static sync(): void;
    }
    class $mol_atom_wait extends Error {
        message: string;
        name: string;
        constructor(message?: string);
    }
    function $mol_atom_task<Value>(handler: () => Value, fail?: (error: Error) => Error | Value): $mol_atom<any>;
}
declare namespace $ {
    function $mol_mem<Host extends {
        objectPath(): string;
    }, Value>(config?: {
        fail?: (host: Host, error: Error) => Value | Error;
        lazy?: boolean;
    }): (obj: Host, name: string, descr: TypedPropertyDescriptor<(next?: Value, prev?: Value) => Value>) => void;
    function $mol_mem_key<Host extends {
        objectPath(): string;
    }, Key, Value>(config?: {
        fail?: (host: Host, error: Error) => Value | Error;
        lazy?: boolean;
    }): (obj: Host, name: string, descr: TypedPropertyDescriptor<(key: Key, next?: Value, prev?: Value) => Value>) => void;
}
declare namespace $ {
    class $mol_window extends $mol_object {
        static size(next?: number[]): number[];
    }
}
declare var localStorage: Storage;
declare namespace $ {
    class $mol_state_local<Value> extends $mol_object {
        static value<Value>(key: string, next?: Value, prev?: Value): any;
        prefix(): string;
        value(key: string, next?: Value): any;
    }
}
declare namespace $ {
    class $mol_http_request extends $mol_object {
        uri(): string;
        method(): string;
        credentials(): {
            login?: string;
            password?: string;
        };
        body(): any;
        'native()': XMLHttpRequest;
        native(): XMLHttpRequest;
        destroyed(next?: boolean): boolean;
        response(next?: XMLHttpRequest, prev?: XMLHttpRequest): XMLHttpRequest;
        text(next?: string): string;
    }
}
declare namespace $ {
    var $mol_http_request_native: () => XMLHttpRequest;
}
declare namespace $ {
    class $mol_http_resource extends $mol_object {
        static item(uri: string): $mol_http_resource;
        uri(): string;
        credentials(): {
            login?: string;
            password?: string;
        };
        request(method: string): $mol_http_request;
        downloader(next?: $mol_http_request[]): $mol_http_request;
        uploader(): $mol_http_request;
        uploaded(): boolean;
        text(next?: string, prev?: string): string;
        dataNext(next?: any): any;
        refresh(): void;
    }
    class $mol_http_resource_json<Content> extends $mol_http_resource {
        static item<Content>(uri: string): $mol_http_resource_json<Content>;
        json(next?: Content, prev?: Content): Content;
    }
}
declare namespace $ {
    interface $mol_locale_dict {
        [key: string]: string;
    }
    class $mol_locale extends $mol_object {
        static lang(next?: string): any;
        static texts(): $mol_locale_dict;
        static text(context: string, key: string): string;
    }
}
declare namespace $ {
    var $mol_viewer_context: $mol_viewer_context;
    interface $mol_viewer_context {
        $mol_viewer_heightLimit(): number;
    }
    class $mol_viewer extends $mol_object {
        static root(id: number): $mol_viewer;
        title(): string;
        static statePrefix(): string;
        statePrefix(): any;
        stateKey(postfix: string): string;
        context(next?: $mol_viewer_context): $mol_viewer_context;
        contextSub(): $mol_viewer_context;
        tagName(): string;
        nameSpace(): string;
        childs(): (string | number | boolean | Node | $mol_viewer)[];
        childsVisible(): (string | number | boolean | Node | $mol_viewer)[];
        heightMinimal(): number;
        private 'DOMNode()';
        DOMNode(next?: Element): Element;
        static renderChilds(node: Element, childs: ($mol_viewer | Node | string | number | boolean)[]): void;
        static renderAttrs(node: Element, attrs: {
            [key: string]: () => string | number | boolean;
        }): void;
        static renderFields(node: Element, fields: {
            [key: string]: (next?: any) => any;
        }): void;
        DOMTree(next?: Element): Element;
        attr(): {
            [key: string]: () => string | number | boolean;
        };
        field(): {
            [key: string]: (next?: any) => any;
        };
        event(): {
            [key: string]: (event: Event) => void;
        };
        focused(): boolean;
        localizedText(postfix: string): string;
    }
}
interface Window {
    cordova: any;
}
declare namespace $ {
}
declare namespace $ {
    class $mol_viewer_selection extends $mol_object {
        static focused(next?: Element[]): Element[];
        static position(...diff: any[]): any;
        static onFocus(event: FocusEvent): void;
        static onBlur(event: FocusEvent): void;
    }
}
declare namespace $ {
}
declare namespace $ {
    class $mol_stringer extends $mol_viewer {
        tagName(): string;
        enabled(): boolean;
        hint(): string;
        type(): string;
        attr(): {
            [key: string]: () => string | number | boolean;
        } & {
            "placeholder": () => any;
            "type": () => any;
        };
        disabled(): boolean;
        value(next?: any, prev?: any): any;
        valueChanged(next?: any, prev?: any): any;
        field(): {
            [key: string]: (next?: any) => any;
        } & {
            "disabled": () => any;
            "value": () => any;
        };
        eventChange(next?: any, prev?: any): any;
        event(): {
            [key: string]: (event: Event) => void;
        } & {
            "input": (next?: any, prev?: any) => any;
        };
    }
}
declare namespace $.$mol {
    class $mol_stringer extends $.$mol_stringer {
        eventChange(next?: Event): void;
        disabled(): boolean;
    }
}
declare namespace $ {
    class $mol_clicker extends $mol_viewer {
        tagName(): string;
        enabled(): boolean;
        activated(next?: any, prev?: any): any;
        eventClick(next?: any, prev?: any): any;
        eventActiveStart(next?: any, prev?: any): any;
        eventActiveCancel(next?: any, prev?: any): any;
        eventActiveDone(next?: any, prev?: any): any;
        event(): {
            [key: string]: (event: Event) => void;
        } & {
            "mousedown": (next?: any, prev?: any) => any;
            "mousemove": (next?: any, prev?: any) => any;
            "mouseup": (next?: any, prev?: any) => any;
        };
        disabled(): boolean;
        attr(): {
            [key: string]: () => string | number | boolean;
        } & {
            "disabled": () => any;
            "tabindex": () => any;
        };
    }
}
declare namespace $.$mol {
    class $mol_clicker extends $.$mol_clicker {
        disabled(): boolean;
        eventActiveStart(next: Event): void;
        eventActiveCancel(next: Event): void;
        eventActiveDone(next: Event): void;
    }
}
declare namespace $ {
    class $mol_clicker_button extends $mol_clicker {
    }
}
declare namespace $ {
    class $mol_clicker_major extends $mol_clicker_button {
    }
}
declare namespace $ {
    class $mol_clicker_minor extends $mol_clicker_button {
    }
}
declare namespace $ {
    class $mol_clicker_danger extends $mol_clicker_button {
    }
}
declare namespace $ {
    class $mol_linker extends $mol_viewer {
        heightMinimal(): number;
        tagName(): string;
        uri(): string;
        current(): boolean;
        attr(): {
            [key: string]: () => string | number | boolean;
        } & {
            "href": () => any;
            "mol_linker_current": () => any;
        };
        arg(): {};
    }
}
declare namespace $ {
    class $mol_state_arg<Value> extends $mol_object {
        prefix: string;
        static href(next?: string): string;
        static dict(next?: {
            [key: string]: string;
        }): {
            [key: string]: string;
        };
        static value(key: string, next?: string, prev?: string): string;
        static link(next: {
            [key: string]: string;
        }): string;
        static make(next: {
            [key: string]: string;
        }): string;
        constructor(prefix?: string);
        value(key: string, next?: string): string;
        sub(postfix: string): $mol_state_arg<{}>;
        link(next: {
            [key: string]: string;
        }): string;
    }
}
declare namespace $.$mol {
    class $mol_linker extends $.$mol_linker {
        uri(): string;
        current(): boolean;
    }
}
declare namespace $ {
    class $mol_checker extends $mol_clicker {
        checked(next?: any, prev?: any): any;
        attr(): {
            [key: string]: () => string | number | boolean;
        } & {
            "disabled": () => any;
            "tabindex": () => any;
        } & {
            "mol_checker_checked": (next?: any, prev?: any) => any;
        };
        icon(): any;
        label(): string;
        labeler(next?: any, prev?: any): $mol_viewer;
        childs(): any[];
    }
}
declare namespace $.$mol {
    class $mol_checker extends $.$mol_checker {
        eventClick(next?: Event): void;
    }
}
declare namespace $ {
    class $mol_scroller extends $mol_viewer {
        heightMinimal(): number;
        scrollTop(next?: any, prev?: any): any;
        scrollLeft(next?: any, prev?: any): any;
        shadowStyle(): string;
        field(): {
            [key: string]: (next?: any) => any;
        } & {
            "scrollTop": (next?: any, prev?: any) => any;
            "scrollLeft": (next?: any, prev?: any) => any;
            "style.boxShadow": () => any;
        };
        eventScroll(next?: any, prev?: any): any;
        event(): {
            [key: string]: (event: Event) => void;
        } & {
            "scroll": (next?: any, prev?: any) => any;
            "overflow": (next?: any, prev?: any) => any;
            "underflow": (next?: any, prev?: any) => any;
        };
    }
}
declare namespace $ {
    class $mol_state_session<Value> extends $mol_object {
        static value<Value>(key: string, next?: Value, prev?: Value): Value;
        prefix(): string;
        value(key: string, next?: Value, prev?: Value): any;
    }
}
declare namespace $ {
    interface $mol_viewer_context {
        $mol_scroller_scrollTop(): number;
        $mol_scroller_moving(): boolean;
    }
}
declare namespace $.$mol {
    class $mol_scroller extends $.$mol_scroller {
        scrollTop(next?: number): number;
        scrollLeft(next?: number): number;
        scrollBottom(next?: number): number;
        scrollRight(next?: number): number;
        eventScroll(next?: Event): void;
        moving(next?: boolean): boolean;
        contextSub(): $mol_viewer_context;
        shadowStyle(): string;
    }
}
declare namespace $ {
    class $mol_lister extends $mol_viewer {
        minHeightStyle(): string;
        field(): {
            [key: string]: (next?: any) => any;
        } & {
            "style.minHeight": () => any;
        };
        rows(): any[];
        childs(): any[];
    }
}
declare namespace $.$mol {
    class $mol_lister extends $.$mol_lister {
        rowOffsets(): number[];
        rowContext(index: number): $mol_viewer_context;
        childsVisible(): any[];
        heightMinimal(): number;
        minHeightStyle(): string;
    }
}
declare namespace $ {
    class $mol_barer extends $mol_viewer {
    }
}
declare namespace $ {
    class $mol_app_todomvc extends $mol_scroller {
        title(): string;
        titler(next?: any, prev?: any): $mol_viewer;
        allCompleterEnabled(): boolean;
        allCompleted(next?: any, prev?: any): any;
        allCompleter(next?: any, prev?: any): $mol_checker;
        taskNewTitle(next?: any, prev?: any): any;
        eventAdd(next?: any, prev?: any): any;
        adder(next?: any, prev?: any): $mol_app_todomvc_adder;
        headerContent(): any[];
        header(next?: any, prev?: any): $mol_viewer;
        taskRows(): any[];
        lister(next?: any, prev?: any): $mol_lister;
        pendingMessage(): string;
        pendinger(next?: any, prev?: any): $mol_viewer;
        filterAllLabel(): string;
        filterAll(next?: any, prev?: any): $mol_linker;
        filterActiveLabel(): string;
        filterActive(next?: any, prev?: any): $mol_linker;
        filterCompletedLabel(): string;
        filterCompleted(next?: any, prev?: any): $mol_linker;
        filterOptions(): any[];
        filter(next?: any, prev?: any): $mol_barer;
        sanitizerEnabled(): boolean;
        eventSanitize(): any;
        sanitizerLabel(): string;
        sanitizer(next?: any, prev?: any): $mol_clicker_minor;
        footerContent(): any[];
        footer(next?: any, prev?: any): $mol_viewer;
        panels(): any[];
        paneler(next?: any, prev?: any): $mol_lister;
        pager(next?: any, prev?: any): $mol_lister;
        childs(): any[];
        taskCompleted(key: any, next?: any, prev?: any): any;
        taskTitle(key: any, next?: any, prev?: any): any;
        eventTaskDrop(key: any, next?: any, prev?: any): any;
        taskRow(key: any, next?: any, prev?: any): $mol_app_todomvc_taskRow;
    }
}
declare namespace $ {
    class $mol_app_todomvc_adder extends $mol_stringer {
        hint(): string;
        eventPress(next?: any, prev?: any): any;
        event(): {
            [key: string]: (event: Event) => void;
        } & {
            "input": (next?: any, prev?: any) => any;
        } & {
            "keyup": (next?: any, prev?: any) => any;
        };
        eventDone(next?: any, prev?: any): any;
    }
}
declare namespace $ {
    class $mol_app_todomvc_taskRow extends $mol_viewer {
        heightMinimal(): number;
        completed(next?: any, prev?: any): any;
        completer(next?: any, prev?: any): $mol_checker;
        titleHint(): string;
        title(next?: any, prev?: any): any;
        titler(next?: any, prev?: any): $mol_stringer;
        eventDrop(next?: any, prev?: any): any;
        dropper(next?: any, prev?: any): $mol_clicker;
        childs(): any[];
        attr(): {
            [key: string]: () => string | number | boolean;
        } & {
            "mol_app_todomvc_taskRow_completed": () => any;
        };
    }
}
interface $mol_app_todomvc_task {
    completed?: boolean;
    title?: string;
}
declare namespace $.$mol {
    class $mol_app_todomvc_adder extends $.$mol_app_todomvc_adder {
        eventPress(next?: KeyboardEvent): any;
    }
    class $mol_app_todomvc extends $.$mol_app_todomvc {
        taskIds(next?: number[]): number[];
        argCompleted(): string;
        groupsByCompleted(): {
            [index: string]: number[];
        };
        tasksFiltered(): number[];
        allCompleted(next?: boolean): boolean;
        allCompleterEnabled(): boolean;
        pendingMessage(): string;
        eventAdd(next: Event): void;
        taskRows(): $mol_app_todomvc_taskRow[];
        task(id: number, next?: $mol_app_todomvc_task, prev?: $mol_app_todomvc_task): any;
        taskCompleted(index: number, next?: boolean): any;
        taskTitle(index: number, next?: string): any;
        eventTaskDrop(index: number, next?: Event): void;
        eventSanitize(): void;
        panels(): ($mol_viewer | $.$mol_lister)[];
        footerVisible(): boolean;
        sanitizerEnabled(): boolean;
    }
}
declare namespace $ {
    class $mol_app_todomvc_demo extends $mol_app_todomvc {
    }
}
