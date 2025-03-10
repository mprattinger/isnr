import { BecTopbar } from "bec-react-components";

export const MainPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col w-1/2">
        <BecTopbar
          programName="ISNR"
          companyLabel="Firma"
          company="Becom Electronics GmbH"
        />
        Hi
      </div>
    </>
  );
};
