import { Card, CardContent } from "@/components/ui/card";

interface Props{
    totalSubmissions:number;
}

export const SubmissionsSection = ({totalSubmissions}:Props) => {
    return(
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Submissions</h2>
            <p>Total Submissions:{totalSubmissions}</p>
          </CardContent>
        </Card>
    );
};