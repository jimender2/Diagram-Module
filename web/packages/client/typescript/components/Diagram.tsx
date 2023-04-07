/**
 * Example of a component which displays an image, given a URL.
 */
import * as React from 'react';
import {
    Component,
    ComponentMeta,
    ComponentProps,
    PComponent,
    PropertyTree,
    SizeObject
} from '@inductiveautomation/perspective-client';

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

// import '../styles/App.css';

// The 'key' or 'id' for this component type.  Component must be registered with this EXACT key in the Java side as well
// as on the client side.  In the client, this is done in the index file where we import and register through the
// ComponentRegistry provided by the perspective-client API.
export const COMPONENT_TYPE = "net.jimender2.diagram";


// This is the shape of the properties we get from the perspective 'props' property tree.
export interface DiagramProps {
    url: string;   // the url of the image this component should display
}

export class Diagram extends Component<ComponentProps<DiagramProps>, any> {
    render() {
        // The props we're interested in.
        const { props: { url }, emit } = this.props;
        console.log(url);
        // Read the 'url' property provided by the perspective gateway via the component 'props'.

        // Note that the topmost piece of dom requires the application of an element reference, events, style and
        // className as shown below otherwise the layout won't work, or any events configured will fail. See render
        // of MessengerComponent in Messenger.tsx for more details.
        return (
            // <h1 {...emit()}>
            //     {url}
            // </h1>
            <ReactDiagram {...emit()}
                initDiagram={initDiagram}
                divClassName='diagram-component'
                nodeDataArray={[
                    { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
                    { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
                    { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
                    { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
                ]}
                linkDataArray={[
                    { key: -1, from: 0, to: 1 },
                    { key: -2, from: 0, to: 2 },
                    { key: -3, from: 1, to: 1 },
                    { key: -4, from: 2, to: 3 },
                    { key: -5, from: 3, to: 0 }
                ]}
                onModelChange={handleModelChange}
            />
        );
    }
}

function handleModelChange(changes: any) {
    changes = changes;
    alert('GoS model changed!');
}
function initDiagram() {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
        $(go.Diagram,
            {
                'undoManager.isEnabled': true,  // must be set to allow for model change listening
                // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
                'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
                model: new go.GraphLinksModel(
                    {
                        linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                    })
            });

    // define a simple Node template
    diagram.nodeTemplate =
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'RoundedRectangle',
                { name: 'SHAPE', fill: 'white', strokeWidth: 0 },
                // Shape.fill is bound to Node.data.color
                new go.Binding('fill', 'color')),
            $(go.TextBlock,
                { margin: 8, editable: true },  // some room around the text
                new go.Binding('text').makeTwoWay()
            )
        );

    return diagram;
}

// This is the actual thing that gets registered with the component registry.
export class DiagramMeta implements ComponentMeta {

    getComponentType(): string {
        return COMPONENT_TYPE;
    }

    // the class or React Type that this component provides
    getViewComponent(): PComponent {
        return Diagram;
    }

    getDefaultSize(): SizeObject {
        return ({
            width: 360,
            height: 360
        });
    }

    // Invoked when an update to the PropertyTree has occurred,
    // effectively mapping the state of the tree to component props.
    getPropsReducer(tree: PropertyTree): DiagramProps {
        return {
            url: tree.readString("url", "")
        };
    }
}
