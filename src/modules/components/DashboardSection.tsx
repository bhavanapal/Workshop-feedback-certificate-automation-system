import { Card, CardContent } from "@/components/ui/card";

interface Props{
    totalForms: number;
    activeForms:number;
    totalSubmissions: number;
}

export const DashboardSection = ({totalForms, activeForms, totalSubmissions}:Props) => {
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg shadow-purple-400/50 duration-300">
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">
                    Total Workshops
                    </p>
                    <h2 className="text-3xl font-bold mt-2">
                       {totalForms}
                    </h2>
                </CardContent>
            </Card>

             <Card className="hover:shadow-lg shadow-purple-400/50 duration-300">
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">
                       Active Forms
                    </p>
                    <h2 className="text-3xl font-bold mt-2">
                       {activeForms}
                    </h2>
                </CardContent>
            </Card>

             <Card className="hover:shadow-lg shadow-purple-400/50 duration-300">
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">
                    Total Submissions
                    </p>
                    <h2 className="text-3xl font-bold mt-2">
                       {totalSubmissions}
                    </h2>
                </CardContent>
            </Card>
        </div>
    );
};