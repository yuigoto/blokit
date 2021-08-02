import {
  BlockEditorKeyboardShortcuts,
  BlockEditorProvider,
  BlockList,
  BlockTools,
  WritingFlow,
  ObserveTyping,
  BlockInspector,
} from '@wordpress/block-editor';
import { serialize, parse } from "@wordpress/blocks";
import { SlotFillProvider, Popover, DropZoneProvider } from "@wordpress/components";
import { useEffect, useState } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';
import Data from "@docs/data/default.json";
import '@wordpress/format-library';
import { useMainContext } from "@docs/context";

export const GutenbergProvider = () => {
  const [blocks, updateBlocks] = useState([]);
  const { setData } = useMainContext();

  const handleUpdateBlocks = (blocks) => {
    localStorage.setItem("blokit_saved_blocks", serialize(blocks));
    updateBlocks(blocks);
  };

  const handlePersistBlocks = (blocks) => {
    localStorage.setItem("blokit_saved_blocks", serialize(blocks));
    setData(serialize(blocks));
  };

  useEffect(() => {
    registerCoreBlocks();

    let data = localStorage.getItem("blokit_saved_blocks");
    if (!data) data = Data.contents;
    setData(data);
    handleUpdateBlocks(parse(data));
  }, []);

  return (
    <div className={"blokit__main"}>
      <SlotFillProvider>
        <DropZoneProvider>
          <BlockEditorProvider
            value={blocks}
            onInput={handleUpdateBlocks}
            onChange={handlePersistBlocks}
          >
            <div className={"blokit__editor"}>
              <BlockTools>
                <div className={"blockit__editor-wrapper"}>
                  <BlockEditorKeyboardShortcuts />
                  <WritingFlow>
                    <ObserveTyping>
                      <BlockList />
                    </ObserveTyping>
                  </WritingFlow>
                </div>
              </BlockTools>
            </div>
            <Popover.Slot />

            <div className={"blokit__sidebar"}>
              <BlockInspector />
            </div>
          </BlockEditorProvider>
        </DropZoneProvider>
      </SlotFillProvider>
    </div>
  );
};

