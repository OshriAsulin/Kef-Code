'use client'

import { Button } from '@/components/ui/Button2'
import { toast } from '@/hooks/use-toast'
import { CommentRequest } from '@/lib/validators/comment'

import { useCustomToasts } from '@/hooks/use-custom-toast'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { Label } from '@/components/ui/Label'
import { TextArea } from '@/components/ui/TextArea'

interface CreateCommentProps {
  problemId: number
  replyToId?: string
}

const CreateComment: FC<CreateCommentProps> = ({ problemId, replyToId }) => {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const { loginToast } = useCustomToasts()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ problemId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { problemId, text, replyToId }

      const { data } = await axios.patch(
        `/api/comment/problem/`,
        payload
      )
      return data
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    },
  })

  return (
    <div className='grid w-full gap-1.5'>
      {/* <Label htmlFor='comment'>התגובה שלך</Label> */}
      <div>
        <TextArea
          id='comment'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder='כתוב פה  את התגובה שלך'
        />

        <div className='mt-2 flex justify-end'>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => comment({ problemId, text: input, replyToId })}>
            שליחה
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment
