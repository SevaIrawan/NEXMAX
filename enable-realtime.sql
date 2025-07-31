-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.member_report_monthly;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deposit_monthly;
ALTER PUBLICATION supabase_realtime ADD TABLE public.withdraw_monthly;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Verify realtime is enabled
SELECT 
    schemaname,
    tablename,
    hasreplicaidentity,
    relreplident
FROM pg_tables 
WHERE tablename IN ('member_report_monthly', 'deposit_monthly', 'withdraw_monthly', 'users')
AND schemaname = 'public';

-- Check publication
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime'; 