import hoistStatics from 'hoist-non-react-statics';
import * as React from 'react';
import { Text } from 'react-native';
import { GraphQLTaggedNode, QueryRenderer, Variables } from 'react-relay';

import Environment from './Environment';

type Config = {
    query: GraphQLTaggedNode;
    queriesParams?: (props: Object) => object;
    variables?: Variables;
    hideSplash?: boolean;
};

export default function createQueryRenderer(
    FragmentComponent,
    Component,
    config: Config
) {
    const { query, queriesParams } = config;

    class QueryRendererWrapper extends React.Component<{}> {
        render() {
            const variables = queriesParams
                ? queriesParams(this.props)
                : config.variables;

            return (
                <QueryRenderer
                    environment={Environment}
                    query={query}
                    variables={variables}
                    render={({ error, props }) => {
                        if (error) {
                            return <Text>{error.toString()}</Text>;
                        }

                        if (props) {
                            return (
                                <FragmentComponent
                                    {...this.props}
                                    query={props}
                                />
                            );
                        }

                        return <Text>loading</Text>;
                    }}
                />
            );
        }
    }

    return hoistStatics(QueryRendererWrapper, Component);
}
