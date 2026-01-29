CREATE TABLE public.chats (  
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT chats_pkey PRIMARY KEY (id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL,
  content jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  chat_id uuid NOT NULL,
  CONSTRAINT messages_pkey PRIMARY KEY (id)
);