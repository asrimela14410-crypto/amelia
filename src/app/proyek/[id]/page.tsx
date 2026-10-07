import ProjectDetailPage, { generateMetadata } from "../../project/[id]/page";

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;
export { generateMetadata };
export default ProjectDetailPage;
