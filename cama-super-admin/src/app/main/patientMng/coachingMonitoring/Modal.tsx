import Modal from "@/components/modal/Modal";

export default function DetailModal(props: any) {
  const { visible, onClose, text, answer } = props;

  return (
    <>
      <Modal
        visible={visible}
        onClose={onClose}
        cancelText="닫기"
        size={"lg"}
        title="질문상세보기"
      >
        <div className="flex  gap-4">
          <div className="h-96 flex-auto w-3/5 relative">
            <textarea
              defaultValue={text}
              readOnly
              className="w-full h-full read-only resize-none text-sm px-2 py-2 focus:outline-0"
            />
          </div>
          <div className="flex gap-4 text-sm w-2/5  font-bold  flex-auto">
            <div className=" ">
              <div className="my-2   pb-2  ">[문답사항]</div>
              {answer?.split("//").map((i: any, key: number) => (
                <p className="text-sm  text-green-600 font-bold" key={key}>
                  {i}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
