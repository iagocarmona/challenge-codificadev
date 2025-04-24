import React from 'react';
import { getInitials } from '@/common/utils/masksUtils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { IClientCardProps } from './clientCard.types';
import { SheetEditClient } from '../modals/EditStudent/sheetEditClient.component';

export const ClientCard: React.FC<IClientCardProps> = ({
  data,
  onDelete,
  refetch,
}) => {
  const [showSheetEdit, setShowSheetEdit] = React.useState(false);

  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(data.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-medium">{data.name}</h2>
          <p className="text-sm text-muted-foreground">{data.email}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSheetEdit(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogPortal>
            <AlertDialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja excluir?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. O cliente será removido
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete?.(data.id)}
                  className="bg-destructive hover:bg-destructive/85"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
      </div>

      {showSheetEdit && (
        <SheetEditClient
          side="right"
          isOpen={showSheetEdit}
          setIsOpen={setShowSheetEdit}
          clientId={data.id}
          refetch={refetch}
        />
      )}
    </Card>
  );
};
