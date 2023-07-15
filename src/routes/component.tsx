// import {Fragment, jsx} from "react/jsx-runtime";

import {ComponentType, useEffect, useMemo, useRef, useState} from "react";

let Text = (props) => {
    return <div {...props} >
        {props.text}
    </div>
}

let Col = (props) => {
    return <div {...props} style={{...props.style, display: "flex", flexDirection: ""}}>
        {props.children}
    </div>
}

let Row = (props) => {
    return <div {...props} >
        {props.children}
    </div>
}

let Button = (props) => {
    props = {...props}
    switch (props.variant) {
        case "ghost":
            props.style = {
                ...props.style,
                background: "transparent",
            }
            break
        default:
            props.style = {
                ...props.style,
            }
    }
    return <button {...props} onClick={props.onMTap}>
        {props.children ? props.children : props.text}
    </button>
}

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

let ComponentX = ({defaultVariant = "primary", variants, children}) => {
    const [variant, setVariant] = useState(defaultVariant)
    const actions = useMemo(() => ({
        setVariant: (v: string) => {
            // console.log('variant', variant)
            if (variant == 'click') {
                setVariant('primary')
            } else {
                setVariant(v)
            }
        }
    }), [variant])

    // hook once
    let main = useMemo(() => hookChildren(children, actions), [actions])

    // 只要有变形，就添加 transition
    // 切换之前的状态也需要添加 transition。

    const previousVariant = usePrevious(variant)

    if (previousVariant) {
        main = addTransition(main, variants[previousVariant])
    }
    if (variants[variant]) {
        main = overrideProps(main, variants[variant])
    }

    const canHover = variants[variant + "_hover"];
    if (canHover) {
        main.props = {
            ...main.props,
            onMouseEnter: () => {
                setVariant(variant + "_hover")
            },
        }
    }
    const inHover = variant.includes("_hover")
    if (inHover) {
        main.props = {
            ...main.props,
            onMouseLeave: () => {
                setVariant(variant.replace("_hover", ""))
            },
        }
    }

    return main
}


function overrideProps(component: any, over: Record<string, any>) {
    component = {...component, props: {...component.props}}
    if (component.props?.id && over[component.props?.id]) {
        component = {
            ...component,
            props: {
                ...component.props,
                ...over[component.props?.id].props,
                style: {
                    ...component.props?.style, ...over[component.props?.id].props?.style,
                    "transition": "all 1s ease-in-out"
                },
                // id: Math.random()
            },
        }
    }

    if (component.props?.children) {
        if (Array.isArray(component.props.children)) {
            component.props.children = component.props.children.map((child) => {
                return overrideProps(child, over)
            })
        } else {
            component.props.children = overrideProps(component.props.children, over)
        }
    }

    return component
}

function addTransition(component: any, over: Record<string, any>) {
    if (!over) {
        return component
    }
    component = {...component, props: {...component.props}}
    if (component.props?.id && over[component.props?.id]) {
        component = {
            ...component,
            props: {
                ...component.props,
                style: {...component.props?.style, "transition": "all 1s ease-in-out"},
            },
        }
    }

    if (component.props?.children) {
        if (Array.isArray(component.props.children)) {
            component.props.children = component.props.children.map((child) => {
                return addTransition(child, over)
            })
        } else {
            component.props.children = addTransition(component.props.children, over)
        }
    }

    return component
}

function hookChildren(component: any, action: Record<string, any>) {
    console.log('hookChildren', component)
    let data = component.props?.onMTap;
    component = {
        ...component,
        props: {
            ...component.props,

            // TODO 如果本来就没有传递 onMTap，则不需要更改
            onMTap: () => {
                console.log('onMTap')
                console.log('component.props.onMTap', data)
                data?.({action})
                // action.setVariant("ghost")
            },
        },
    }

    if (component.props?.children) {
        if (Array.isArray(component.props.children)) {
            component.props.children = component.props.children.map((child) => {
                return hookChildren(child, action)
            })
        } else {
            component.props.children = addTransition(component.props.children, over)
        }
    }

    return component
}

function withComponent(Component: ComponentType<any>, {
    type
}) {
    return function (props) {
        return <Component {...props} data-component-type={type}/>
    }
}

const Components = {
    "row": withComponent(Row, {type: "row"}),
    "col": withComponent(Col, {type: "col"}),
    "text": withComponent(Text, {type: "text"}),
    "button": withComponent(Button, {type: "button"}),
    "component": withComponent(ComponentX, {type: "component"}),
}

// 以后用这个数据来生成 jsx 代码。
//
// nodeTree
const nodeTree = [
    {
        type: "_root",
        props: {
            children: [
                {
                    type: "row",
                    props: {
                        style: {background: "#d7ffbf"}, children: [
                            {type: "text", id: "2334", props: {style: {}, text: "line 1"}}]
                    }
                },
                {
                    type: "col",
                    props: {
                        style: {background: "#ffa09c"},
                        children:
                            [
                                {type: "text", id: "2336", props: {style: {flex: "1 1 0%"}, text: "line 2 left"}},
                                {type: "text", id: "2337", props: {style: {flex: "1 1 0%"}, text: "line 2 right"}}
                            ]
                    }
                },
                {
                    type: "text", props: {style: {background: "#ccdcff", flex: "1 1 0%"}, text: "line 3"},
                },
                {
                    type: "button",
                    props: {style: {background: "#6d8eff", padding: "8px 16px"}, text: "btn", variant: ""}
                },
                {
                    type: "button",
                    props: {style: {background: "#6d8eff", padding: "8px 16px"}, text: "ghost", variant: "ghost"}
                },
                {
                    type: "component",
                    props: {
                        // style: {
                        //     background: "#94ff8f", padding: "8px 16px"
                        // },
                        children: {
                            type: "col",
                            id: "col-1",
                            props: {
                                style: {background: "#ffa09c",},
                                children:
                                    [
                                        {
                                            type: "button",
                                            id: "button-1",
                                            props: {
                                                style: {
                                                    flex: "1 1 0%",
                                                    background: "#4376ff",
                                                    padding: "8px 16px",
                                                    borderRadius: "8px"
                                                },
                                                children: [
                                                    {
                                                        id: "text-1",
                                                        type: "text", props: {style: {flex: "1 1 0%"}, text: "Click me"}
                                                    }
                                                ],
                                                onMTap: ({action}) => {
                                                    action?.setVariant?.("click")
                                                }
                                            },
                                        },
                                        {
                                            type: "text",
                                            id: "text-2",
                                            props: {style: {flex: "1 1 0%"}, text: "line 2 right"}
                                        }
                                    ]
                            }
                        }
                        ,
                        variants: {
                            primary_hover: {
                                "col-1": {
                                    props: {
                                        style: {background: "#84b1ff", padding: "20px"}
                                    }
                                },
                                "button-1": {
                                    props: {
                                        style: {background: "#e3fff6"},
                                    }
                                },
                                "text-1": {
                                    props: {
                                        style: {color: "red"},
                                        text: "hovered"
                                    }
                                }
                            },
                            click: {
                                "col-1": {
                                    props: {
                                        style: {background: "#84b1ff", padding: "30px"}
                                    }
                                },
                                "text-1": {
                                    props: {
                                        style: {color: "white"},
                                        text: "clicked"
                                    }
                                },
                                "text-2": {
                                    props: {
                                        style: {color: "white"},
                                        text: "clicked"
                                    }
                                },
                            }
                        },
                        defaultVariant: "primary"
                    }
                },
            ]
        }
    },
]

// <Tab a=b c=d style={{}} clasName="" />

class NodeTree {
    private nodeIdMap: {};

    constructor(nodeTree) {
        const nodeIdMap = {}
        nodeTree.forEach((node) => {
            nodeIdMap[node.id] = node
        })

        this.nodeIdMap = nodeIdMap
    }

    public nodeToJsx(node) {
        const {type, id, props} = node

        let children = null
        if (props.children) {
            if (Array.isArray(props.children)) {
                children = props.children.map((node) => {
                    return this.nodeToJsx(node)
                })
            } else {
                children = this.nodeToJsx(props.children)
            }
        }
        if (type === "_root") {
            return <>{children}</>
        }

        // if (props.variants) {
        //     Object.keys(props.variants).forEach((key) => {
        //         props.variants[key] = this.nodeToJsx(props.variants[key])
        //     })
        // }

        let C = Components[type];
        return <C id={id} {...props} children={children}/>
    }
}

// interface
function Pages() {
    let nodeTree1 = new NodeTree(nodeTree);
    return nodeTree1.nodeToJsx(nodeTree[0])
}

export default function Component() {
    return <div>
        <Pages/>
    </div>
}
