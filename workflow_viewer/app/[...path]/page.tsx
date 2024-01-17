import fetchData from "../../lib/fetchData";
import { TableSort } from "../../components/TableSort/TableSort";
import Shell from "../../components/Shell";

export default async function PathPage({ params }: any) {
  const data = await fetchData(params.path ?? []);

  return (
    <Shell>
      <TableSort data={data} />
    </Shell>
  );
}
