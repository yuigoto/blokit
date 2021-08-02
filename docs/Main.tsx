import { GutenbergProvider } from "@docs/components/gutenberg/GutenbergProvider";
import { BaseHeader } from "@docs/components/base/BaseHeader";
import { BaseFooter } from "@docs/components/base/BaseFooter";

const Main = () => {
  return (
    <div className={"blokit"}>
      <BaseHeader />
      <GutenbergProvider />
      <BaseFooter />
    </div>
  );
};

export default Main;
