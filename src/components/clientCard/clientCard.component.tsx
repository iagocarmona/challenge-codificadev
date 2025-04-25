// components/clientCard/clientCard.component.tsx
import React from 'react';
import {
  getInitials,
  maskCellphone,
  maskCNPJ,
} from '@/common/utils/masksUtils';
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
import { Badge } from '../ui/badge';
import { maskDecimalWithAcronym } from '@/common/utils/mask';

export const ClientCard: React.FC<IClientCardProps> = ({
  data,
  onDelete,
  onEdit,
}) => {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(data.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <h2 className="mr-4 text-lg font-medium">{data.name}</h2>
            <Badge
              className={
                data.status === 'active'
                  ? 'mr-4 bg-green-500 text-white hover:bg-green-500/80'
                  : 'mr-4 bg-destructive text-destructive-foreground'
              }
            >
              {data.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{data.email}</p>
        </div>
        <div className="flex flex-col gap-1 border-l pl-4">
          <p className="text-sm font-medium">CNPJ: {maskCNPJ(data.cnpj)}</p>
          <p className="text-sm text-muted-foreground">
            Telefone: {maskCellphone(data.phone)}
          </p>

          <p className="text-sm text-muted-foreground">
            Pagamento Mensal:{' '}
            {maskDecimalWithAcronym(data.monthlyPayment, 'R$')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit?.(data.id)}>
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
    </Card>
  );
};
