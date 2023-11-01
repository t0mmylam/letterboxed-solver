import React, { useEffect, useState } from "react";
import { Solution, columns } from "./solutions";
import { AnswerTable } from "./AnswerTable";

interface DemoPageProps {
    answers: Solution[];
}

const DemoPage: React.FC<DemoPageProps> = ({ answers = [] }) => {
    const [data, setData] = useState<Solution[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            setData(answers);
        }
        fetchData();
    }, [answers]);

    if (data === null) {
        // This will never occur in our case which probably isn't the greatest strategy lol
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <AnswerTable columns={columns} data={data} />
        </div>
    );
};

export default DemoPage;
