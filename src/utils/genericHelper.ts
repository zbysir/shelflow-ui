export const getUniqueNodeId = () => {
    return Math.random().toString(36).substr(2, 9);
}


export const initializeDefaultNodeData = (nodeParams: any[]) => {
    const initialValues = {}

    for (let i = 0; i < nodeParams.length; i += 1) {
        const input = nodeParams[i]
        initialValues[input.key] = input.default || ''
    }

    return initialValues

}


export const initNode = (nodeData: any, id: string) => {
    nodeData.id = id;
    if (nodeData.input_params) {
        nodeData.input_params.forEach((inputParam: any) => {
            inputParam.id = getUniqueNodeId();
        })
        nodeData.inputs = initializeDefaultNodeData(nodeData.input_params)
    } else {
        nodeData.inputs = {};
        nodeData.input_params = []
    }
    return nodeData
}