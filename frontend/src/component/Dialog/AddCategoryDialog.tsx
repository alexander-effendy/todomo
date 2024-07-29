import { Dialog, Transition, TransitionChild, DialogTitle } from '@headlessui/react';
import { Fragment, useState, useRef, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Context } from "@/UseContext";
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { postCategory } from '@/api/category';

interface MyModalProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export default function MyModal({ isOpen, closeModal }: MyModalProps) {
  const { update, setUpdate } = useContext(Context);
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input element
  const [currentCategoryInput, setCurrentCategoryInput] = useState<string>('');
  const { getToken, user } = useKindeAuth();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus(); // Focus the input element when the modal opens
    }
  }, [isOpen]); // Depend on `isOpen`

  const handleAddCategory = async () => {
    if (currentCategoryInput.length < 3) {
      alert('Category name length cannot be short than 3 letters');
      return;
    }
    if (!user) return;
    const token = await getToken();
    await postCategory(token, currentCategoryInput, user.email);
    setCurrentCategoryInput('');
    setUpdate(!update)
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Insert new category name
                  </DialogTitle>
                  <div className="mt-2">
                    <input
                      ref={inputRef}
                      value={currentCategoryInput}
                      onChange={(e) => setCurrentCategoryInput(e.target.value)}
                      placeholder="Category name"
                      className="border p-2 w-full"
                    />
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      className="rounded-[5px] inline-flex justify-center border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>

                    <Button
                      className="rounded-[5px] inline-flex justify-center border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        closeModal();
                        handleAddCategory();
                      }}
                    >
                      Add category
                    </Button>
                  </div>
                </Dialog.Panel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
