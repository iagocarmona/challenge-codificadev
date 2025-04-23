import { getInitials } from '@/utils/masksUtils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { IClientCardProps } from './clientCard.types';
export const ClientCard: React.FC<IClientCardProps> = ({ data, onClick }) => {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={data?.avatarUrl || ''}
            className="h-full w-full rounded-full object-cover"
          />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(data?.name || '')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-medium">{data?.name}</h2>
          <p className="text-sm text-muted-foreground">{data?.email}</p>
        </div>
      </div>
      <div className="mr-2 flex gap-3">
        {/* ALERT DIALOG */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja excluir?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. O cliente será removido
                permanentemente do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onClick}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};
