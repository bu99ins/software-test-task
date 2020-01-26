update public.clients
set
    firstname = ${firstname},
    surname = ${surname}
where id = ${clientId};