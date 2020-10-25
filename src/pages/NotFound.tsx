import React from "react";
import { Stack } from "@fluentui/react";
import { NotFound } from "components";

class Page extends React.Component {
    render(): JSX.Element {
        return (
            <Stack style={{ paddingTop: 50 }}>
                <NotFound />
            </Stack>
        );
    }
}

export const NotFoundPage = Page;
