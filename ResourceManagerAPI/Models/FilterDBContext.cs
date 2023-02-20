using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ResourceManagerAPI.Models
{
    public partial class FilterDBContext : DbContext
    {

        //public FilterDBContext()
        //{
        //}

        public FilterDBContext(DbContextOptions<FilterDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<FilterViewModel> employee { get; set; } //= null!;
        public virtual DbSet<FilterViewModel> skill { get; set; }// = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FilterViewModel>(entity =>
            {

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.TaskName)
                      .HasMaxLength(250)
                      .IsUnicode(false);
                entity.Property(e => e.AssignedFrom)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.AssignedTo)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.AvailableFrom)
                   .HasMaxLength(250)
                   .IsUnicode(false);
                entity.Property(e => e.AvailableTo)
                    .HasMaxLength(250)
                    .IsUnicode(false);


                entity.Property(e => e.ResourceName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.EmailID)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.SkillGroup)
                      .HasMaxLength(250)
                      .IsUnicode(false);
                entity.Property(e => e.Skill)
                    .HasMaxLength(250)
                    .IsUnicode(false);

            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}